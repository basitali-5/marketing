# n8n Dashboard Webhooks

Import `dashboard-webhooks-workflow.json` into n8n and activate it.

Set these variables for Django:

```env
N8N_WEBHOOK_BASE_URL=https://basitali122.app.n8n.cloud/webhook/
N8N_POST_OPTIONS_WEBHOOK_URL=https://basitali122.app.n8n.cloud/webhook/pro
N8N_IMAGE_WEBHOOK_URL=https://basitali122.app.n8n.cloud/webhook/generate-image
N8N_VIDEO_WEBHOOK_URL=https://basitali122.app.n8n.cloud/webhook/video
N8N_PUBLISH_WEBHOOK_URL=https://basitali122.app.n8n.cloud/webhook/publish
```

Dashboard flow:

- Reference options call `/generate-options`.
- Image generation calls `/generate-image`.
- Video generation calls `/product`.
- Scheduling/publish calls `/publish`.

The imported workflow uses Code nodes with demo media URLs so it runs without paid credentials. Replace those Code nodes with your preferred generation and publishing nodes, but keep the same response shapes:

```json
{ "image_urls": ["https://..."], "urls": ["https://..."] }
```

```json
{ "video_urls": ["https://...mp4"], "urls": ["https://...mp4"] }
```

```json
{ "status": "scheduled", "scheduled_at": "2026-09-15T10:00:00" }
```
