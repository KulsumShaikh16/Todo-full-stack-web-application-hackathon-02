"""Registry for MCP tools to be used by the AI Agent."""

from .tools import (
    add_task, update_task, delete_task, complete_task,
    list_tags, add_tags_to_task, remove_tag_from_task,
    list_tasks, search_tasks
)

# Tool definitions for Gemini function calling
TOOLS_METADATA = [
    {
        "function_declarations": [
            {
                "name": "add_task",
                "description": "Create a new todo task with optional priority, due date, tags, and recurrence.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "title": {"type": "string", "description": "The title or name of the task."},
                        "description": {"type": "string", "description": "An optional detailed description of the task."},
                        "priority": {
                            "type": "string", 
                            "enum": ["HIGH", "MEDIUM", "LOW"],
                            "description": "Task priority level. Defaults to MEDIUM."
                        },
                        "due_date": {"type": "string", "description": "ISO 8601-formatted due date string (e.g., '2026-02-10T10:00:00Z')."},
                        "tags": {
                            "type": "array", 
                            "items": {"type": "string"},
                            "description": "List of tag names to associate with the task."
                        },
                        "recurrence_pattern": {
                            "type": "string",
                            "enum": ["daily", "weekly", "monthly"],
                            "description": "How often the task should repeat after completion."
                        },
                        "reminder_time": {"type": "string", "description": "ISO 8601-formatted reminder timestamp."}
                    },
                    "required": ["title"]
                }
            },
            {
                "name": "list_tasks",
                "description": "Retrieve tasks for the user with advanced filtering by status, priority, and tags.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "status": {
                            "type": "string", 
                            "enum": ["all", "pending", "completed"],
                            "description": "Filter tasks by completion status."
                        },
                        "priority": {
                            "type": "string", 
                            "enum": ["HIGH", "MEDIUM", "LOW"],
                            "description": "Filter by priority level."
                        },
                        "tags": {
                            "type": "array", 
                            "items": {"type": "string"},
                            "description": "Filter by tasks having ALL these tags."
                        }
                    }
                }
            },
            {
                "name": "search_tasks",
                "description": "Search for tasks using keywords in the title or description.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query_text": {"type": "string", "description": "The keyword or phrase to search for."}
                    },
                    "required": ["query_text"]
                }
            },
            {
                "name": "update_task",
                "description": "Modify any aspect of an existing task including its metadata.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "The unique ID of the task to update."},
                        "title": {"type": "string", "description": "The new title."},
                        "description": {"type": "string", "description": "The new description."},
                        "priority": {"type": "string", "enum": ["HIGH", "MEDIUM", "LOW"]},
                        "due_date": {"type": "string", "description": "New ISO 8601 due date."},
                        "completed": {"type": "boolean", "description": "Update completion status."},
                        "recurrence_pattern": {"type": "string", "enum": ["daily", "weekly", "monthly"]},
                        "reminder_time": {"type": "string", "description": "New ISO 8601 reminder time."}
                    },
                    "required": ["task_id"]
                }
            },
            {
                "name": "complete_task",
                "description": "Mark a task as completed. If it's a recurring task, the next instance will be created automatically.",
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
                "description": "Remove a task permanently.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "The unique ID of the task to delete."}
                    },
                    "required": ["task_id"]
                }
            },
            {
                "name": "list_tags",
                "description": "List all tags used in the system.",
                "parameters": {"type": "object", "properties": {}}
            },
            {
                "name": "add_tags_to_task",
                "description": "Associate one or more tags with a task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "Task ID."},
                        "tags": {"type": "array", "items": {"type": "string"}, "description": "List of tag names."}
                    },
                    "required": ["task_id", "tags"]
                }
            },
            {
                "name": "remove_tag_from_task",
                "description": "Dissociate a tag from a task.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "task_id": {"type": "integer", "description": "Task ID."},
                        "tag_name": {"type": "string", "description": "The tag name to remove."}
                    },
                    "required": ["task_id", "tag_name"]
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
    "update_task": update_task,
    "search_tasks": search_tasks,
    "list_tags": list_tags,
    "add_tags_to_task": add_tags_to_task,
    "remove_tag_from_task": remove_tag_from_task
}
