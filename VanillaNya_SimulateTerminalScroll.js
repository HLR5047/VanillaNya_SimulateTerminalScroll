//=============================================================================
// VanillaNya_SimulateTerminalScroll.js
//=============================================================================

/*:
 * @plugindesc 模拟终端滚动
 * @author VanillaNya
 *
 * @help 这个插件会模拟终端的滚动，当输入不足最大行数时会在后方补充空行，当超出最大行数时会删除前方的行以塞入新的内容。
 * 适配Drill_up的'Drill_DialogOperator'，可以搭配Drill_up的'Drill_CoreOfString'
 * 本作者的默认方案依赖Drill_up的'Drill_DialogOperator'和'Drill_CoreOfString'
 * 
 * 在需要的时候你得手动清空字符串来清空过去的输出，在默认方案中可以这样
 * $gameStrings.setValue(1, '');
 * 
 * 这是展开的使用
 * const newTerminalContent = "hello world";
 * const displayContent = processTerminalOutput(newTerminalContent);
 * $gameMessage.add(displayContent);
 * 
 * 这是简化后的使用
 * $gameMessage.add(processTerminalOutput("hello world"));
 * 
 * 提示：你可以使用$gameMessage.add();来创建一个游戏对话框
 * 
 * @param 最大行数变量
 * @desc 必填，游戏变量，用于最大行数判断
 * 默认：20
 * 这意味着会使用20号变量的值判断
 * @default 20
 * 
 * @param 字符串
 * @desc 必填，输出用的
 * 默认：$gameStrings.value(1)
 * 这代表Drill_CoreOfString的1号字符串
 * @default $gameStrings.value(1)
 * 
 * @param 字符串最终处理
 * @desc 必填，填入代码，如何最后如何自动处理字符串？
 * 默认：$gameStrings.setValue(1, combined.join('\\n'));
 * 这会把字符串的输入重新覆盖回去
 * @default $gameStrings.setValue(1, combined.join('\\n'));
 */

// 参数转换工具：将插件参数转为数字（带默认值回退）
function toNumber(str, def) {
    return isNaN(str) ? def : +(str || def);
}

// 插件参数初始化
var parameters = PluginManager.parameters('VN_SimulateTerminalScroll');
const VN_maxLines = toNumber(parameters['最大行数变量'], 20); // 存储行数变量ID
const VN_stringParam = String(parameters['字符串'] || '$gameStrings.value(1)'); // 字符串存储位置
const VN_stringCode = parameters['字符串最终处理']  // 存储时的回调逻辑
    ? String(parameters['字符串最终处理']) 
    : '$gameStrings.setValue(1, combined.join("\\n"))';

// 获取当前存储的字符串内容（受Drill_CoreOfString插件支持）
function getGameString() {
    try {
        return typeof eval(VN_stringParam) === 'string' ? eval(VN_stringParam) : '';
    } catch (e) {
        return ''; // 异常时返回空字符串
    }
}

// 核心处理函数：管理终端内容滚动
function processTerminalOutput(newInput) {
    // 阶段1：准备数据
    const history = getGameString().split('\n').filter(line => line.trim() !== ''); // 有效历史记录
    const newLines = newInput.split('\n').filter(line => line !== ''); // 有效新内容
    
    // 阶段2：合并内容
    let combined = history.concat(newLines);
    const maxLines = $gameVariables.value(VN_maxLines); // 实时获取最大行数
    
    // 阶段3：内容截断
    combined = combined.slice(-maxLines); // 保留最近N条
    
    // 阶段4：显示处理
    const displayContent = [...combined]; // 显示副本
    while (displayContent.length < maxLines) {
        displayContent.push(''); // 填充空白行保证显示稳定
    }
    
    // 阶段5：持久化存储
    try {
        // 通过动态函数执行存储逻辑（配合插件参数设置）
        new Function('combined', VN_stringCode)(combined);
    } catch (e) {
        console.error('[存储异常]', e); // 存储失败时记录错误
    }
    
    return displayContent.join('\n'); // 返回处理后的显示文本
}