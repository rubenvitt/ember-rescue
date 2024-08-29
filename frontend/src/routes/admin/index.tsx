import { createFileRoute } from '@tanstack/react-router';
// @ts-ignore
import type { IpPortPair } from 'tauri-plugin-network-api';
import { AdminTemplate } from '../../components/atomic/templates/Admin.component.js';

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
});

function AdminPage() {
  return <AdminTemplate />;
}