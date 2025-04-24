**这个插件的用途**

它会连接新的输入和历史输出，达到类似DOS终端滚动的效果
你可以用它的输出做任何事
这个RPGMakerMV插件会模拟终端的滚动，当输入不足最大行数时会在后方补充空行，当超出最大行数时会删除前方的行以塞入新的内容。
适配Drill_up的'Drill_DialogOperator'，可以搭配Drill_up的'Drill_CoreOfString'
本作者的默认方案依赖Drill_up的'Drill_DialogOperator'和'Drill_CoreOfString'
**使用方法**

这是一个相当手动的插件，你需要使用脚本进行输入
在需要的时候你得手动清空字符串来清空过去的输出，在默认方案中可以这样
$gameStrings.setValue(1, '');
我一般用这个插件的输出直接输出到对话框，如下：
这是展开的使用
const newTerminalContent = "hello world";
const displayContent = processTerminalOutput(newTerminalContent);
$gameMessage.add(displayContent);

这是简化后的使用
$gameMessage.add(processTerminalOutput("hello world"));

提示：你可以使用$gameMessage.add();来创建一个游戏对话框

就连我也不太理解它是如何运行的
