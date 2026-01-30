// lib/gtag.ts
export const GA_EVENTS = {
    // === 核心下载漏斗 (Downloader Funnel) ===
    F_PARSE_CLICK: 'funnel_1_parse_click',       // 用户点击解析按钮
    F_PARSE_SUCCESS: 'funnel_2_parse_success',   // 解析接口返回结果
    F_DOWNLOAD_CLICK: 'funnel_3_download_click', // 用户点击下载按钮（意图）
    F_DOWNLOAD_SUCCESS: 'funnel_4_download_success', // 文件下载完成并消耗点数（成功）

    // === 脚本提取漏斗 (Transcript Funnel) ===
    F_EXTRACT_START: 'funnel_1_extract_start',   // 开始提取脚本 （首页用户点击提取按钮）
    F_EXTRACT_SUCCESS: 'funnel_2_extract_success', // 脚本提取成功（数据渲染完成）

    // === AI 生成器漏斗 (AI Generator Funnel)===
    F_GEN_START: 'funnel_1_gen_start',           // AI 页面开始解析（手动输入或首页跳转）
    F_GEN_INFO_SUCCESS: 'funnel_2_gen_info_success', // AI 页面视频标题、语言列表加载成功
    F_GEN_CONTENT_SUCCESS: 'funnel_3_gen_content_success', // 脚本提取成功（扣除 1 点）
    F_GEN_AI_SUCCESS: 'funnel_4_gen_ai_success', // AI 总结生成成功（扣除 1 点，最高价值动作）

    // === 支付与转化漏斗 (Payment Funnel) ===
    F_PRICING_VIEW: 'funnel_pricing_view',       // 进入定价页面 (Pricing Page)
    F_PAY_CLICK: 'funnel_pay_click',             // 点击支付按钮 (Stripe 或 PayPal)
    F_PAY_SUCCESS: 'funnel_pay_success',         // 支付成功完成
    UI_PRICING_TOGGLE: 'ui_pricing_toggle',      // 切换 月/年 付费开关
    ERR_PAYMENT: 'error_payment_failed',         // 支付过程或校验报错

    // === 订阅转化关键点 (Revenue/Paywall) ===
    F_PAYWALL_VIEW: 'funnel_paywall_view',       // 弹出订阅弹窗（因为 Credit 不足）

    // === UI 交互事件 (UI Interactions) === 
    UI_TAB_SWITCH: 'ui_tab_switch',             // 单个/批量模式切换
    UI_PASTE_CLICK: 'ui_paste_click',           // 点击快捷粘贴
    UI_PARSE_ANOTHER: 'ui_parse_another',       // 点击“解析另一个”
    
    UI_TRANS_LANG: 'ui_transcript_lang_change', // 切换脚本语言
    UI_TRANS_VIEW: 'ui_transcript_view_mode',   // 切换时间戳/纯文本视图
    UI_TRANS_ACTION: 'ui_transcript_action',    // 点击拷贝、下载 SRT 或下载 TXT
    UI_TRANS_RETRY: 'ui_transcript_retry',      // 提取失败后的点击重试

    UI_GEN_VIEW: 'ui_gen_view_switch',          // AI 页切换 AI总结/原始脚本 视图
    UI_GEN_TRANS_MODE: 'ui_gen_trans_mode',     // AI 页切换脚本的 时间/文本 模式
    UI_THINKING_TOGGLE: 'ui_gen_thinking_toggle', // 点击展开/收起 AI 的思维链 (Reasoning)
    UI_GEN_ACTION: 'ui_gen_action',             // AI 页的拷贝或导出动作

    // === 登录拦截相关 ===
    UI_LOGIN_PROMPT: 'ui_login_prompt_view',    // 登录拦截弹窗显示
    UI_LOGIN_CLICK: 'ui_login_click',           // 用户在拦截时点击了登录

    // === 错误监控 (Error Tracking) ===
    ERR_PARSE: 'error_parse_failed',            // 视频解析接口报错
    ERR_EXTRACT: 'error_extract_failed',        // 脚本提取接口报错
    ERR_GEN: 'error_gen_failed',                // AI 总结生成环节报错

    // === 导航与跨工具引导 (Navigation & Referral) ===
    NAV_TOOL_CLICK: 'nav_tool_click',           // 点击页面底部的其他工具链接
    NAV_AI_REMIX: 'nav_ai_remix_click',         // 在下载成功页点击“AI Remix”引流至 AI 生成器
    UI_AI_VIEW: 'ui_ai_script_view',            // 在首页下载列表点击“Transcript”打开抽屉

    // === 问卷事件 ===
    UI_SURVEY_VIEW: 'ui_survey_modal_view',   // 问卷弹出
    UI_SURVEY_SUBMIT: 'ui_survey_submit',     // 提交问卷
    UI_SURVEY_SKIP: 'ui_survey_skip',         // 关闭/跳过问卷
} as const;

/**
 * 封装 GA 事件追踪函数
 * @param eventName 事件名称
 * @param params 事件参数
 */

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag('event', eventName, params);
    }
};
