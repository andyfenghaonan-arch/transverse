# Moloc Data Visualization Platform

一个交互式的网页平台，用于可视化和分析Moloc（多位点共定位分析）数据。

## 🌟 功能特点

- **交互式数据探索**：通过下拉菜单选择基因、疾病/性状和暴露因子
- **智能级联过滤**：选择一个选项后，其他选项自动过滤，只显示有匹配数据的选项
- **记录数量显示**：每个选项显示对应的记录数量，帮助用户了解数据分布
- **多种可视化方式**：
  - 后验概率图：比较不同共定位假设的概率
  - 证据热图：显示证据强度的分布
  - 详细结果表：完整的数据表格视图
  - SNP证据图：分析SNP频率和平均概率

## 📊 数据说明

本平台处理Moloc分析结果，包含以下信息：
- **PP A**: 只有性状A有因果变异的概率
- **PP B**: 只有性状B有因果变异的概率  
- **PP C**: 只有性状C有因果变异的概率
- **PP AB**: 性状A和B共享因果变异的概率
- **PP AC**: 性状A和C共享因果变异的概率
- **PP BC**: 性状B和C共享因果变异的概率
- **PP ABC**: 三个性状都共享因果变异的概率

## 🚀 在线访问

**GitHub Pages地址**: `(https://andyfenghaonan-arch.github.io/transverse/)`

## 📁 文件结构

```
eqtl-visualization/
├── index.html              # 主页面
├── script.js              # JavaScript逻辑
├── style.css              # 样式文件
├── Transverse.2MR.moloc   # Moloc数据文件
├── data.json              # JSON数据文件（如果需要）
└── README.md              # 项目说明
```

## 🔧 本地运行

1. 克隆仓库到本地
2. 启动本地服务器（必须使用HTTP协议，不能直接打开HTML文件）：
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 或使用Node.js
   npx serve .
   ```
3. 访问 `http://localhost:8000`

## 📋 部署到GitHub Pages

1. **创建GitHub仓库**
2. **上传所有文件**
3. **启用GitHub Pages**：
   - 进入仓库的Settings页面
   - 滚动到Pages部分
   - 选择Source为"Deploy from a branch"
   - 选择分支为"main"或"master"
   - 选择文件夹为"/ (root)"
   - 点击Save
4. **等待部署完成**（通常1-2分钟）
5. **访问你的网站**：`https://yourusername.github.io/repository-name/`

## 💡 使用说明

1. **页面加载**：网页会自动加载Moloc数据并显示初始可视化
2. **选择过滤器**：
   - 选择基因：其他选项会自动过滤
   - 选择疾病/性状：其他选项会相应更新
   - 选择暴露因子：其他选项会相应更新
3. **切换可视化类型**：使用"Visualization Type"下拉菜单
4. **查看详细信息**：右侧面板显示当前选择的详细分析信息

## 🛠️ 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **图表库**: Chart.js, D3.js
- **部署**: GitHub Pages
- **数据格式**: TSV (Tab-Separated Values)

## 📈 数据格式要求

Moloc数据文件应包含以下列：
- `exposure`: 暴露因子
- `outcome`: 结果变量
- `gene`: 基因名称
- `diseases`: 疾病/性状名称
- `nsnps`: SNP数量
- `pp_a`, `pp_b`, `pp_c`, `pp_ab`, `pp_ac`, `pp_bc`, `pp_abc`: 各种后验概率
- `best_SNP_*`: 最佳SNP信息

## 🎨 自定义

你可以通过修改以下文件来自定义界面：
- `style.css`: 修改颜色、字体、布局等
- `script.js`: 修改可视化逻辑或添加新功能
- `index.html`: 修改页面结构或添加新元素

## 📞 支持

如有问题或建议，请创建Issue。

---

**注意**: 由于浏览器安全限制，本网站必须通过HTTP(S)协议访问，不能直接打开本地HTML文件。建议部署到GitHub Pages或使用本地服务器。
