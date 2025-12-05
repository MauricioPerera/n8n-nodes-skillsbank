import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SkillsBankApi implements ICredentialType {
	name = 'skillsBankApi';
	displayName = 'Skills Bank API';
	documentationUrl = 'https://skills-api.automators.work/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://skills-api.automators.work',
			description: 'The base URL of the Skills Bank API',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Skills Bank API key (generate from your profile)',
		},
	];
}
