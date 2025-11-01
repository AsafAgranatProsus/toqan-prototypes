export const playsData = [
  {
    "id": "play-001",
    "title": "Find the Right Dashboard Instantly",
    "description": "Stop wasting time searching. Tell me what data you need, and I'll find the correct dashboard and explain the key metrics.",
    "domain": "Data & Analytics",
    "seedData": {
      "playId": "play-001",
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
    "id": "play-002",
    "title": "Document New Data Products Automatically",
    "description": "Tired of writing documentation? I inspect new data pipelines and schemas in Databricks and draft the documentation for you.",
    "domain": "Data & Analytics",
    "seedData": {
      "playId": "play-002",
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
    "id": "play-003",
    "title": "Avoid Rebuilding Existing Datasets",
    "description": "Before you build a new data product, ask me. I'll search across Databricks to see if a suitable dataset already exists.",
    "domain": "Data & Analytics",
    "seedData": {
      "playId": "play-003",
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
    "id": "play-004",
    "title": "Update Old Queries After Data Migration",
    "description": "Migrated your database? Give me your old queries, and I'll automatically remap them to the new data sources and schemas.",
    "domain": "Data & Analytics",
    "seedData": {
      "playId": "play-004",
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
  {
    "id": "play-005",
    "title": "Find the Right Dashboard Instantly",
    "description": "Stop wasting time searching. Tell me what data you need, and I'll find the correct dashboard and explain the key metrics.",
    "domain": "Data & Analytics",
    "seedData": {
      "playId": "play-001",
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
    "id": "play-006",
    "title": "Document New Data Products Automatically",
    "description": "Tired of writing documentation? I inspect new data pipelines and schemas in Databricks and draft the documentation for you.",
    "domain": "Data & Analytics",
    "seedData": {
      "playId": "play-002",
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
    "id": "play-007",
    "title": "Avoid Rebuilding Existing Datasets",
    "description": "Before you build a new data product, ask me. I'll search across Databricks to see if a suitable dataset already exists.",
    "domain": "Data & Analytics",
    "seedData": {
      "playId": "play-003",
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
    "id": "play-008",
    "title": "Update Old Queries After Data Migration",
    "description": "Migrated your database? Give me your old queries, and I'll automatically remap them to the new data sources and schemas.",
    "domain": "Data & Analytics",
    "seedData": {
      "playId": "play-004",
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
  }
];
