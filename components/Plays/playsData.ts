export const playsData = [
  {
    "id": "play-001",
    "title": "Smart Calendar Manager",
    "description": "Automatically protect focused work time, eliminate scheduling conflicts, and optimize team productivity by intelligently coordinating meeting times.",
    "domain": "Productivity",
    "department": "Operations",
    "type": "Automation",
    "seedData": {
      "playId": "play-001",
      "type": "Optimizer",
      "goal": "Automate calendar management and protect focus time",
      "source": "Google Calendar API + Meeting Platforms",
      "output": "Optimized Schedule + Notifications",
      "clarityStatement": "this agent acts as your intelligent calendar assistant, automatically managing your schedule by protecting focus time, resolving conflicts, and coordinating meetings across your team.",
      "whatItDoes": "You spend too much time managing your calendar manually, dealing with scheduling conflicts, and losing focused work time to back-to-back meetings.",
      "howItWorks": [
        "Analyzes your work patterns and upcoming deadlines to identify when focus blocks are most needed.",
        "Automatically creates and updates focus time blocks in Google Calendar, protecting these periods from meeting requests.",
        "Detects scheduling conflicts and either automatically reschedules non-critical meetings or suggests optimal alternative times.",
        "Adds appropriate travel time buffers before and after in-person meetings based on location data.",
        "Updates availability status across integrated platforms and sends proactive notifications about schedule changes."
      ]
    }
  },
  {
    "id": "play-002",
    "title": "Market Researcher",
    "description": "Continuously monitor competitor activities and market trends, providing real-time alerts and structured intelligence reports for strategic decisions.",
    "domain": "Business Intelligence",
    "department": "Strategy",
    "type": "Discovery",
    "seedData": {
      "playId": "play-002",
      "type": "Analyst",
      "goal": "Automate competitive intelligence and market monitoring",
      "source": "Web Sources + News Feeds + Industry Publications",
      "output": "Intelligence Reports + Executive Summaries",
      "clarityStatement": "this agent continuously monitors the competitive landscape and market trends, transforming scattered data into actionable intelligence reports that help leadership make informed strategic decisions.",
      "whatItDoes": "Your team needs real-time competitive intelligence and market insights but manual monitoring is time-consuming and critical information often gets missed.",
      "howItWorks": [
        "Continuously scans web sources, news feeds, and industry publications for mentions of competitors and relevant market trends.",
        "Collects and processes data using advanced analytics to identify patterns, significant changes, and emerging opportunities or threats.",
        "Analyzes gathered intelligence to determine relevance and impact level for your organization's strategic goals.",
        "Compiles findings into structured executive summaries and detailed intelligence reports using predefined templates.",
        "Delivers timely alerts and scheduled reports to leadership teams with actionable insights and recommendations."
      ]
    }
  },
  {
    "id": "play-003",
    "title": "Project Status Tracking Agent",
    "description": "Automatically update project milestones, task statuses, and deliverable stages based on completion triggers and predefined criteria.",
    "domain": "Project Management",
    "department": "Operations",
    "type": "Automation",
    "seedData": {
      "playId": "play-003",
      "type": "Tracker",
      "goal": "Automate project status updates and milestone tracking",
      "source": "Project Management Tools + Task Data",
      "output": "Updated Status Reports + Progress Tracking",
      "clarityStatement": "this agent automatically tracks and updates project progress across all phases, ensuring accurate milestone tracking and consistent project monitoring without manual status updates.",
      "whatItDoes": "You need to maintain accurate project tracking across multiple phases and deliverables, but manually updating statuses is tedious and prone to inconsistencies.",
      "howItWorks": [
        "Receives updates regarding project milestones, task statuses, and deliverable stages from team members or integrated tools.",
        "Tracks and collects data according to predefined criteria and completion conditions.",
        "Applies status progression automatically when completion conditions are met.",
        "Consistently monitors development of projects across various phases and provides real-time visibility into progress."
      ]
    }
  },
  {
    "id": "play-004",
    "title": "Find the Right Dashboard Instantly",
    "description": "Stop wasting time searching. Tell me what data you need, and I'll find the correct dashboard and explain the key metrics.",
    "domain": "Data & Analytics",
    "department": "Analytics",
    "type": "Discovery",
    "seedData": {
      "playId": "play-004",
      "type": "Navigator",
      "goal": "Find and understand dashboards",
      "source": "Existing Dashboards (e.g., Looker)",
      "output": "Link + Explanation",
      "clarityStatement": "this agent acts as your personal dashboard librarian. It helps you locate the correct dashboard based on the data or metrics you need and provides a summary of its purpose and key information.",
      "whatItDoes": "You need to quickly find the right dashboard for your data analysis but aren't sure where to look.",
      "howItWorks": [
        "Tell the agent what data, metrics, or business question you have.",
        "It searches through available dashboards (e.g., Looker) to find the best match.",
        "It provides a direct link to the dashboard and explains what it shows and how to use it."
      ]
    }
  },
  {
    "id": "play-005",
    "title": "Document New Data Products Automatically",
    "description": "Tired of writing documentation? I inspect new data pipelines and schemas in Databricks and draft the documentation for you.",
    "domain": "Data & Analytics",
    "department": "Data Engineering",
    "type": "Automation",
    "seedData": {
      "playId": "play-005",
      "type": "Documenter",
      "goal": "Generate data product documentation",
      "source": "Databricks ETL code/pipelines",
      "output": "Documentation Draft",
      "clarityStatement": "this agent automatically generates standardized documentation for your new data products by inspecting the code and metadata directly within Databricks.",
      "whatItDoes": "You have created new data pipelines or tables in Databricks and need to document them, but writing documentation is time-consuming.",
      "howItWorks": [
        "Point the agent to the specific Databricks notebook, pipeline, or schema you want to document.",
        "It analyzes the code, infers column definitions, lineage, and business logic.",
        "It generates a draft documentation page (e.g., in Confluence) following team standards."
      ]
    }
  },
  {
    "id": "play-006",
    "title": "Avoid Rebuilding Existing Datasets",
    "description": "Before you build a new data product, ask me. I'll search across Databricks to see if a suitable dataset already exists.",
    "domain": "Data & Analytics",
    "department": "Data Engineering",
    "type": "Discovery",
    "seedData": {
      "playId": "play-006",
      "type": "Researcher",
      "goal": "Find existing data products",
      "source": "Databricks data catalog/metadata",
      "output": "List of relevant datasets",
      "clarityStatement": "this agent acts as a smart search engine for your data lake. It helps you discover if datasets relevant to your needs already exist within Databricks before you start building.",
      "whatItDoes": "You are about to start building a new dataset or data product and want to ensure similar data doesn't already exist, preventing duplicated effort.",
      "howItWorks": [
        "Describe the data or business problem you are trying to address.",
        "The agent searches the Databricks data catalog, metadata, and potentially documentation.",
        "It returns a list of potentially relevant existing tables, views, or pipelines, with descriptions."
      ]
    }
  },
  {
    "id": "play-007",
    "title": "Update Old Queries After Data Migration",
    "description": "Migrated your database? Give me your old queries, and I'll automatically remap them to the new data sources and schemas.",
    "domain": "Data & Analytics",
    "department": "Data Engineering",
    "type": "Migration",
    "seedData": {
      "playId": "play-007",
      "type": "Converter",
      "goal": "Migrate legacy SQL queries",
      "source": "Old SQL query + Mapping Docs",
      "output": "Updated SQL Query",
      "clarityStatement": "this agent automatically translates your legacy SQL queries to be compatible with new database structures or schemas, saving significant manual effort after a migration.",
      "whatItDoes": "Your team has migrated to a new database or updated schemas, breaking old SQL queries, and manually updating them is tedious.",
      "howItWorks": [
        "Provide the agent with the old SQL query (or multiple queries).",
        "Give it access to documentation or a mapping file that explains the changes between the old and new schemas.",
        "The agent analyzes the query and the mapping, then rewrites the SQL to work with the new structure."
      ]
    }
  },
 
];
