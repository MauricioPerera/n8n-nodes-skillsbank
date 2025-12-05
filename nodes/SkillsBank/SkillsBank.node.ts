import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class SkillsBank implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Skills Bank',
		name: 'skillsBank',
		icon: 'file:skillsbank.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Execute skills from Skills Bank',
		defaults: {
			name: 'Skills Bank',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'skillsBankApi',
				required: true,
			},
		],
		properties: [
			// Resource
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Skill',
						value: 'skill',
					},
					{
						name: 'Group',
						value: 'group',
					},
				],
				default: 'skill',
			},

			// Skill Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['skill'],
					},
				},
				options: [
					{
						name: 'Execute',
						value: 'execute',
						description: 'Execute a skill',
						action: 'Execute a skill',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get skill details',
						action: 'Get skill details',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all public skills',
						action: 'List all public skills',
					},
					{
						name: 'List My Skills',
						value: 'listMine',
						description: 'List your own skills (public and private)',
						action: 'List your own skills',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search skills',
						action: 'Search skills',
					},
				],
				default: 'execute',
			},

			// Group Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['group'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get group with skills',
						action: 'Get group with skills',
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all groups',
						action: 'List all groups',
					},
					{
						name: 'Execute Skill',
						value: 'executeSkill',
						description: 'Execute a skill from group',
						action: 'Execute skill from group',
					},
				],
				default: 'list',
			},

			// Skill ID for execute/get
			{
				displayName: 'Skill ID',
				name: 'skillId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['skill'],
						operation: ['execute', 'get'],
					},
				},
				description: 'The ID or name of the skill',
			},

			// Input for skill execution
			{
				displayName: 'Input',
				name: 'input',
				type: 'json',
				default: '{}',
				required: true,
				displayOptions: {
					show: {
						resource: ['skill'],
						operation: ['execute'],
					},
				},
				description: 'Input parameters for the skill (JSON)',
			},

			// Search query
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['skill'],
						operation: ['search'],
					},
				},
				description: 'Search term for skills',
			},

			// Group ID
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['get', 'executeSkill'],
					},
				},
				description: 'The ID of the group',
			},

			// Skill ID for group execution
			{
				displayName: 'Skill ID',
				name: 'groupSkillId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['executeSkill'],
					},
				},
				description: 'The ID of the skill within the group',
			},

			// Input for group skill execution
			{
				displayName: 'Input',
				name: 'groupInput',
				type: 'json',
				default: '{}',
				required: true,
				displayOptions: {
					show: {
						resource: ['group'],
						operation: ['executeSkill'],
					},
				},
				description: 'Input parameters for the skill (JSON)',
			},

			// Additional Options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Dry Run',
						name: 'dryRun',
						type: 'boolean',
						default: false,
						description: 'Whether to validate without executing',
					},
					{
						displayName: 'Include Schema',
						name: 'includeSchema',
						type: 'boolean',
						default: false,
						description: 'Whether to include input schema in response',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('skillsBankApi');
		const apiUrl = credentials.apiUrl as string;
		const apiKey = credentials.apiKey as string;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let response: any;
				const options = this.getNodeParameter('options', i, {}) as any;

				if (resource === 'skill') {
					if (operation === 'execute') {
						const skillId = this.getNodeParameter('skillId', i) as string;
						const inputStr = this.getNodeParameter('input', i) as string;
						const input = typeof inputStr === 'string' ? JSON.parse(inputStr) : inputStr;

						const endpoint = options.dryRun
							? `${apiUrl}/skills/${skillId}/dry-run`
							: `${apiUrl}/skills/${skillId}/run`;

						response = await this.helpers.request({
							method: 'POST',
							url: endpoint,
							headers: {
								'Authorization': `ApiKey ${apiKey}`,
								'Content-Type': 'application/json',
							},
							body: { input },
							json: true,
						});

					} else if (operation === 'get') {
						const skillId = this.getNodeParameter('skillId', i) as string;
						response = await this.helpers.request({
							method: 'GET',
							url: `${apiUrl}/skills/${skillId}`,
							headers: {
								'Authorization': `ApiKey ${apiKey}`,
							},
							json: true,
						});

					} else if (operation === 'list') {
						response = await this.helpers.request({
							method: 'GET',
							url: `${apiUrl}/skills`,
							headers: {
								'Authorization': `ApiKey ${apiKey}`,
							},
							json: true,
						});

					} else if (operation === 'listMine') {
						response = await this.helpers.request({
							method: 'GET',
							url: `${apiUrl}/skills/mine`,
							headers: {
								'Authorization': `ApiKey ${apiKey}`,
							},
							json: true,
						});

					} else if (operation === 'search') {
						const query = this.getNodeParameter('searchQuery', i) as string;
						response = await this.helpers.request({
							method: 'GET',
							url: `${apiUrl}/skills/search?q=${encodeURIComponent(query)}`,
							headers: {
								'Authorization': `ApiKey ${apiKey}`,
							},
							json: true,
						});
					}

				} else if (resource === 'group') {
					if (operation === 'list') {
						response = await this.helpers.request({
							method: 'GET',
							url: `${apiUrl}/groups`,
							headers: {
								'Authorization': `ApiKey ${apiKey}`,
							},
							json: true,
						});

					} else if (operation === 'get') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						response = await this.helpers.request({
							method: 'GET',
							url: `${apiUrl}/groups/${groupId}`,
							headers: {
								'Authorization': `ApiKey ${apiKey}`,
							},
							json: true,
						});

					} else if (operation === 'executeSkill') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const skillId = this.getNodeParameter('groupSkillId', i) as string;
						const inputStr = this.getNodeParameter('groupInput', i) as string;
						const input = typeof inputStr === 'string' ? JSON.parse(inputStr) : inputStr;

						// First verify skill is in group
						const groupResponse = await this.helpers.request({
							method: 'GET',
							url: `${apiUrl}/groups/${groupId}`,
							headers: {
								'Authorization': `ApiKey ${apiKey}`,
							},
							json: true,
						});

						const skillInGroup = groupResponse.skills?.some((s: any) =>
							s.id === skillId || s.name === skillId
						);

						if (!skillInGroup) {
							throw new NodeOperationError(
								this.getNode(),
								`Skill ${skillId} is not in group ${groupId}`,
								{ itemIndex: i }
							);
						}

						// Execute the skill
						const endpoint = options.dryRun
							? `${apiUrl}/skills/${skillId}/dry-run`
							: `${apiUrl}/skills/${skillId}/run`;

						response = await this.helpers.request({
							method: 'POST',
							url: endpoint,
							headers: {
								'Authorization': `ApiKey ${apiKey}`,
								'Content-Type': 'application/json',
							},
							body: { input },
							json: true,
						});

						// Add group context to response
						response.group = { id: groupId, name: groupResponse.name };
					}
				}

				returnData.push({ json: response });

			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
