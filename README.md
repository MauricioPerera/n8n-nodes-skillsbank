# n8n-nodes-skillsbank

This is an n8n community node for [Skills Bank](https://skills.automators.work) - a platform for executing and managing reusable code skills.

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-skillsbank`
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-skillsbank
```

## Features

### Skill Operations

- **Execute** - Run a skill with input parameters
- **Get** - Get skill details by ID
- **List** - List all public skills
- **List My Skills** - List your own skills (public and private)
- **Search** - Search skills by query

### Group Operations

- **List** - List all skill groups
- **Get** - Get a group with its skills
- **Execute Skill** - Execute a skill from a specific group

## Credentials

You need to configure Skills Bank API credentials:

1. **API URL**: The base URL of the Skills Bank API (default: `https://skills-api.automators.work`)
2. **API Key**: Your personal API key (generate from your profile at https://skills.automators.work)

## Usage Examples

### Execute a Skill

1. Add the Skills Bank node
2. Select **Skill** resource and **Execute** operation
3. Enter the Skill ID
4. Provide input JSON:
   ```json
   {
     "value": 42
   }
   ```

### List Your Skills

1. Add the Skills Bank node
2. Select **Skill** resource and **List My Skills** operation
3. Returns all your public and private skills

### Search Skills

1. Add the Skills Bank node
2. Select **Skill** resource and **Search** operation
3. Enter your search query
4. Returns matching public skills

## Options

- **Dry Run**: Validate input without executing the skill
- **Include Schema**: Include input schema in response

## Resources

- [Skills Bank](https://skills.automators.work)
- [API Documentation](https://skills-api.automators.work/docs)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

## License

MIT
