# Video Workflow Update

Your Django endpoint sends this payload to the video webhook:

```json
{
  "prompt": "A cinematic description for the video",
  "reference_text": "Brand playbook and visual direction",
  "output_count": 2,
  "aspectRatio": "16:9",
  "job_id": 42
}
```

In the `Sample Video Generator C` n8n workflow, update the AI Agent prompt to read the webhook body instead of using fixed text:

```text
Create exactly {{$json.body.output_count || 2}} distinct cinematic video prompts.

Creative brief: {{$json.body.prompt}}
Brand reference: {{$json.body.reference_text}}
Aspect ratio: {{$json.body.aspectRatio || '16:9'}}

Return only valid JSON in this shape:
{
  "job_id": {{$json.body.job_id}},
  "videos": [
    { "prompt": "...", "variant": "01" },
    { "prompt": "...", "variant": "02" }
  ]
}
```

Split `videos` into individual items before the Magic Hour request, use each item's `prompt` in `style.prompt`, then merge the completed Drive `webContentLink` values. Send the result back to Django with an HTTP Request node:

```text
POST {{ $env.DJANGO_CALLBACK_URL }}/api/videos/callback/
{
  "job_id": {{ $('Webhook').item.json.body.job_id }},
  "video_urls": {{ $json.video_urls }}
}
```

Set `DJANGO_CALLBACK_URL` in n8n to your Render API domain. This lets the dashboard move from its loading state to the two-video comparison once both MP4 files are available.
