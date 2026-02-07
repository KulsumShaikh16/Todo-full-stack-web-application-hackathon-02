import logging
import google.generativeai as genai
from .gemini_client import get_model, init_gemini
try:
    from mcp.registry import TOOLS_METADATA, TOOL_FUNCTIONS
except ImportError:
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from mcp.registry import TOOLS_METADATA, TOOL_FUNCTIONS

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are FocusFlow AI, a premium todo management assistant. 
You help users manage their goals through natural conversation.

CORE CAPABILITIES:
1. Add/Create tasks: Use 'add_task' (supports priority, tags, due_date, and recurrence)
2. List tasks: Use 'list_tasks' (supports filtering by 'priority', 'status', and 'tags')
3. Search tasks: Use 'search_tasks' (search keywords in title or description)
4. Update tasks: Use 'update_task' (modify any property of an existing task)
5. Complete tasks: Use 'complete_task' (automatically handles recurring tasks)
6. Delete tasks: Use 'delete_task'
7. Tag management: Use 'list_tags', 'add_tags_to_task', or 'remove_tag_from_task'

PHASE 5 FEATURES:
- PRIORITY: HIGH, MEDIUM, LOW. Help users categorize tasks by importance.
- TAGS: Use tags like #work, #personal, #urgent. A task can have up to 10 tags.
- DUE DATES: Set specific deadlines for tasks.
- RECURRENCE: Support 'daily', 'weekly', and 'monthly' tasks.
- REMINDERS: Set timestamps for when the user should be notified.

BEHAVIOR GUIDELINES:
- When a user mentions a time or priority, use the corresponding fields in 'add_task' or 'update_task'.
- If a user wants to find something specific, use 'search_tasks' or 'list_tasks' with filters.
- Be proactive: if a user says "I need to do laundry every week", set the recurrence_pattern to 'weekly'.
- Always use the tools to interact with the task database.
- Be concise, professional, and encouraging.

RESPONSE TEMPLATES:
- ADDED: "I've successfully added **'[Task Name]'** to your pipeline with [Priority/Tag/Due Date details]. It's now visible in your dashboard."
- SEARCHED: "I found [number] tasks matching your request: [list them]."
- COMPLETED: "Excellent! I've marked **'[Task Name]'** as completed. [If recurring: The next instance has been scheduled for you.]"
"""


async def run_todo_agent(user_id: str, message: str, history: list = None) -> dict:
    """
    Run the todo agent with the user's message and history.
    
    Args:
        user_id: The ID of the user (passed to all tool calls)
        message: The user's new message
        history: Previous messages in Gemini format (list of dicts with role/parts)
        
    Returns:
        dict: response text and any tool calls made
    """
    # Ensure Gemini is initialized
    init_gemini()
    
    model = get_model(
        tools=TOOLS_METADATA,
        system_instruction=SYSTEM_PROMPT
    )
    
    # Start chat with history and send message
    try:
        chat = model.start_chat(history=history or [])
        response = chat.send_message(message)
    except Exception as e:
        logger.error(f"Error sending message to Gemini: {e}")
        return {"response": f"I'm sorry, I encountered an error communicating with the AI: {str(e)}", "tool_calls": []}
    
    tool_calls_info = []
    
    # Handle possible tool calls (Function Calling loop)
    # Gemini handles multiple tool calls in one response turn if needed
    
    while True:
        has_tool_call = False
        parts_for_next_turn = []
        
        for part in response.parts:
            if part.function_call:
                has_tool_call = True
                func_name = part.function_call.name
                func_args = dict(part.function_call.args)
                
                logger.info(f"Agent calling tool: {func_name} with args: {func_args}")
                
                # Execute tool implementation
                if func_name in TOOL_FUNCTIONS:
                    # Inject user_id into args
                    actual_args = {**func_args, "user_id": user_id}
                    try:
                        result = TOOL_FUNCTIONS[func_name](**actual_args)
                    except Exception as e:
                        logger.error(f"Execution error in tool {func_name}: {e}")
                        result = {"error": str(e)}
                else:
                    result = {"error": f"Tool {func_name} is not registered."}
                
                tool_calls_info.append({
                    "tool": func_name,
                    "arguments": func_args,
                    "result": result
                })
                
                # Prepare response part for the model with the tool output
                parts_for_next_turn.append(
                    genai.protos.Part(
                        function_response=genai.protos.FunctionResponse(
                            name=func_name,
                            response={"result": result}
                        )
                    )
                )
        
        if not has_tool_call:
            break
            
        # Send tool results back to the model to get the final textual response
        try:
            response = chat.send_message(parts_for_next_turn)
        except Exception as e:
            logger.error(f"Error sending tool results to Gemini: {e}")
            return {"response": f"I'm sorry, I encountered an error processing the task action: {str(e)}", "tool_calls": tool_calls_info}

    # Extract final text response
    final_text = ""
    for part in response.parts:
        if part.text:
            final_text += part.text
            
    # If no text was returned but tool calls were made, provide a fallback (though Gemini should provide text)
    if not final_text and tool_calls_info:
        final_text = f"I've updated your tasks. Is there anything else you'd like to do?"
        
    return {
        "response": final_text,
        "tool_calls": tool_calls_info
    }
