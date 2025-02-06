import { createLazyFileRoute } from '@tanstack/react-router';
import { UAVTemplatesPage } from '../../pages/UAVTemplatesPage.js';

export const Route = createLazyFileRoute('/admin/uav')({
    component: UAVTemplatesPage,
}); 