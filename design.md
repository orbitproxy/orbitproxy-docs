# 官方视频：运营配置与文档卡片

文档「官方视频」改成 [Grafana Tutorials](https://grafana.com/tutorials/) 那种资源卡片。视频内容由运营平台配置，做法对齐现有博客。文档页只读已发布数据。点击卡片在新标签打开播放地址，站内不嵌播放器，也没有视频详情页。

## 卡片上有什么

和 Grafana 的 `card-resource` 一样，一张卡四块信息：

1. **封面**，铺在卡片顶部，固定 16:9，不随文案变高。
2. **类型**，封面下方一行：播放图标 +「视频」。颜色用控制台主色 `#4f46e5`。
3. **标题**，最多两行，超出省略。
4. **简介**，最多三行，超出省略。
5. **底栏**，分类名，例如 `API网关`。

三列排布（窄屏两列，再窄一列）。同一行卡片等高。封面比例、标题行数、简介行数都锁死，长文案不会把卡片撑变形。

点击整张卡片：`window.open` 式的新标签，地址是运营填的播放链接（Bilibili 或其它 https 播放页）。`target="_blank"`，`rel="noopener noreferrer"`。

分类筛选放在卡片网格上面，第一项是「全部」，其余来自运营配置的视频分类。只显示已发布视频。

## 运营平台配什么

侧栏在「博客 / 博客分类」旁边加两项，交互和博客相同：

- **视频分类**：名称、slug、排序。分类下还有视频时不能删。
- **视频**：新建、编辑、发布、下线、删除。列表可按分类、状态、标题搜索。

一条视频的字段：

| 字段 | 作用 | 约束 |
| --- | --- | --- |
| 分类 | 卡片底栏，以及文档页筛选 | 必选，必须是已有分类 |
| 标题 | 卡片标题 | 必填，最长 200 |
| 简介 | 卡片上的描述。这就是正文，不再另做站内文章页 | 必填，最长 500 |
| 封面 | 卡片顶部 poster | 必填，走现有媒体桶，和博客封面同一套上传 |
| 播放地址 | 点击后打开的页面 | 必填，`https` URL。Bilibili 视频页或其它播放页都可以 |
| slug | 运营侧稳定标识 | 必填，规则与博客 slug 相同。文档站不拿它做详情路由 |
| 状态 | `draft` / `published` | 新建为草稿。只有已发布的会出现在文档站 |

没有视频详情页，所以不存 Markdown 正文。简介就是卡片上的那段话。

发布、下线、保存已发布内容的行为与博客一致：下线后文档站不再展示；再次发布不改第一次的发布时间。文档站读取缓存 60 秒，和博客相同。

## 接口

控制面按博客拆两套路由。

运营（要登录）：

- `GET/POST /v1/admin/videos/categories`
- `PATCH/DELETE /v1/admin/videos/categories/:id`
- `GET/POST /v1/admin/videos`
- `GET/PATCH/DELETE /v1/admin/videos/:id`
- `POST /v1/admin/videos/:id/publish`
- `POST /v1/admin/videos/:id/unpublish`
- `POST /v1/admin/videos/assets` 上传封面，返回 `objectKey` 和 `url`

文档站公开读：

- `GET /v1/website/videos/categories`
- `GET /v1/website/videos?category={slug}`

公开列表只返回已发布项，字段：`title`、`summary`、`coverUrl`、`playUrl`、`category: { name, slug }`、`publishedAt`。不返回 slug 以外的内部 id，封面只给可访问的 `coverUrl`。

## 文档站怎么接

`/docs/start/videos` 不再把视频写死在 MDX 里。页面服务端拉取上面的公开接口，交给现在的视频列表组件渲染。组件改成 Grafana 这套结构：封面、类型行、标题、简介、分类底栏。筛选按钮的数据来自分类接口。

现有四条写在 MDX 里的视频，上线时由运营在后台重新录入（含封面和 Bilibili 地址），不在代码里做一次性迁移。

## 不做的事

- 不在文档站内嵌 Bilibili 播放器。
- 不做 `/docs/videos/:slug` 这种详情页。
- 不把视频推进百度，也不复用博客的百度推送。
