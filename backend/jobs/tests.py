from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient


class UploadReferenceFileTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_image_endpoint_accepts_reference_file_in_multipart_form(self):
        file_data = SimpleUploadedFile(
            'reference.png',
            b'fake-image-content',
            content_type='image/png',
        )

        response = self.client.post(
            '/api/images/',
            {
                'title': 'Test image',
                'prompt': 'Luxury campaign photo',
                'reference_text': 'Warm premium brand look',
                'reference_file': file_data,
            },
            format='multipart',
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertIn('image_urls', response.data)
        self.assertIn('job', response.data)
