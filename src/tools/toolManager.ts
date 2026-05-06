import type { ExampleFetcher } from '../core/exampleFetcher.js';
import type { ManifestStore } from '../core/manifestLoader.js';
import { PolicyStore } from '../exec/policyStore.js';
import type {
  ICacheManager,
  ISearchEngine,
  Tool,
  ToolDefinition,
} from '../types/index.js';
import { GetExampleTool } from './getExampleTool.js';
import { ListExamplesTool } from './listExamplesTool.js';
import { OverviewTool } from './overviewTool.js';
import { WebSearchTool } from './webSearchTool.js';

import { ConfigureSetupTool } from './cli/configure/setup.js';
import {
  ConfigureListTool,
  ConfigureShowTool,
  ConfigureUseTool,
  ConfigureDeleteTool,
} from './cli/configure/manage.js';
import { GetBalanceTool } from './cli/query/balance.js';
import { ListMessagesTool } from './cli/query/messages.js';
import { ListSenderIdsTool } from './cli/query/senderid.js';
import { GetQuotaTool, ListQuotaRequestsTool } from './cli/query/quota.js';
import {
  ListKakaoChannelsTool,
  GetKakaoChannelTool,
  ListKakaoChannelCategoriesTool,
  ListKakaoChannelGroupsTool,
  GetKakaoChannelGroupTool,
  ListKakaoTemplatesTool,
  GetKakaoTemplateTool,
  ListKakaoTemplateCategoriesTool,
  GetKakaoTemplateSendableTool,
  ListKakaoBrandTemplatesTool,
  GetKakaoBrandTemplateSendableTool,
} from './cli/kakao/queries.js';
import { SendSmsTool } from './cli/send/sms.js';
import { SendLmsTool } from './cli/send/lms.js';
import { SendMmsTool } from './cli/send/mms.js';
import { SendRcsTool } from './cli/send/rcs.js';
import { SendAtaTool } from './cli/send/ata.js';
import { SendBmsTool } from './cli/send/bms.js';
import { DeleteSenderIdTool, UpdateSenderIdTool } from './cli/senderid/mutations.js';
import { RequestQuotaTool } from './cli/quota/request.js';
import {
  CreateKakaoTemplateTool,
  UpdateKakaoTemplateTool,
  DeleteKakaoTemplateTool,
  InspectKakaoTemplateTool,
  CancelInspectKakaoTemplateTool,
  ReleaseDormantKakaoTemplateTool,
  CreateKakaoBrandTemplateTool,
  UpdateKakaoBrandTemplateTool,
  DeleteKakaoBrandTemplateTool,
} from './cli/kakao/mutations.js';
import { GetMcpPolicyTool, UpdateMcpPolicyTool } from './policy/policyTools.js';
import { UpgradeSolactlTool } from './cli/upgrade.js';

export interface ToolManagerDeps {
  cache: ICacheManager;
  searchEngine: ISearchEngine;
  manifest: ManifestStore;
  fetcher: ExampleFetcher;
}

export class ToolManager {
  private tools: Map<string, Tool>;

  constructor(deps: ToolManagerDeps) {
    const policy = new PolicyStore();

    const docsTools: Tool[] = [
      new ListExamplesTool(deps.manifest),
      new GetExampleTool(deps.manifest, deps.fetcher),
      new OverviewTool(deps.cache, deps.manifest),
      new WebSearchTool(deps.searchEngine, deps.cache),
    ];

    const configureTools: Tool[] = [
      new ConfigureSetupTool(),
      new ConfigureListTool(),
      new ConfigureShowTool(),
      new ConfigureUseTool(),
      new ConfigureDeleteTool(),
    ];

    const queryTools: Tool[] = [
      new GetBalanceTool(),
      new ListMessagesTool(),
      new ListSenderIdsTool(),
      new GetQuotaTool(),
      new ListQuotaRequestsTool(),
      new ListKakaoChannelsTool(),
      new GetKakaoChannelTool(),
      new ListKakaoChannelCategoriesTool(),
      new ListKakaoChannelGroupsTool(),
      new GetKakaoChannelGroupTool(),
      new ListKakaoTemplatesTool(),
      new GetKakaoTemplateTool(),
      new ListKakaoTemplateCategoriesTool(),
      new GetKakaoTemplateSendableTool(),
      new ListKakaoBrandTemplatesTool(),
      new GetKakaoBrandTemplateSendableTool(),
    ];

    const sendTools: Tool[] = [
      new SendSmsTool(policy),
      new SendLmsTool(policy),
      new SendMmsTool(policy),
      new SendRcsTool(policy),
      new SendAtaTool(policy),
      new SendBmsTool(policy),
    ];

    const mutationTools: Tool[] = [
      new DeleteSenderIdTool(),
      new UpdateSenderIdTool(),
      new RequestQuotaTool(),
      new CreateKakaoTemplateTool(),
      new UpdateKakaoTemplateTool(),
      new DeleteKakaoTemplateTool(),
      new InspectKakaoTemplateTool(),
      new CancelInspectKakaoTemplateTool(),
      new ReleaseDormantKakaoTemplateTool(),
      new CreateKakaoBrandTemplateTool(),
      new UpdateKakaoBrandTemplateTool(),
      new DeleteKakaoBrandTemplateTool(),
    ];

    const policyTools: Tool[] = [
      new GetMcpPolicyTool(policy),
      new UpdateMcpPolicyTool(policy),
    ];

    const adminTools: Tool[] = [new UpgradeSolactlTool()];

    const all: Tool[] = [
      ...docsTools,
      ...configureTools,
      ...queryTools,
      ...sendTools,
      ...mutationTools,
      ...policyTools,
      ...adminTools,
    ];

    this.tools = new Map(all.map((t) => [t.getDefinition().name, t]));
  }

  getToolDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.getDefinition());
  }

  async executeTool(name: string, args: Record<string, unknown>) {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Unknown tool: ${name}`);
    return tool.execute(args);
  }
}
