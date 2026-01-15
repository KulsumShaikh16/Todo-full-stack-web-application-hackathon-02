"""Registry for MCP tools to be used by the AI Agent."""

from .tools import add_task, list_tasks, complete_task, delete_task, update_task

# Tool definitions for Gemini function calling
TOOLS_METADATA = [
    {
        "function_declarations": [
            {
                "name": "add_task",
                "description": "Create a new todo task for the user.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "The title or name of the task."},
                        "description": {"type": "string", "description": "An optional detailed description of the task."}
                    },
                    "required": ["title"]
                }
            },
            {
                "name": "list_tasks",
                "description": "Retrieve a list of tasks for the user.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string", 
                            "enum": ["all", "pending", "completed"],
                            "description": "Filter tasks by status. Defaults to 'all'."
                        }
                    }
                }
            },
            {
                "name": "complete_task",
                "description": "Mark a specific task as completed.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "The unique ID of the task to complete."}
                    },
                    "required": ["task_id"]
                }
            },
            {
                "name": "delete_task",
                "description": "Remove a specific task permanently.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "The unique ID of the task to delete."}
                    },
                    "required": ["task_id"]
                }
            },
            {
                "name": "update_task",
                "description": "Modify the title or description of an existing task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "The unique ID of the task to update."},
                        "title": {"type": "string", "description": "The new title for the task."},
                        "description": {"type": "string", "description": "The new description for the task."}
                    },
                    "required": ["task_id"]
                }
            }
        ]
    }
]

# Mapping from function names to actual Python functions
TOOL_FUNCTIONS = {
    "add_task": add_task,
    "list_tasks": list_tasks,
    "complete_task": complete_task,
    "delete_task": delete_task,
    "update_task": update_task
}
