import type { Client, ComplianceTask } from '../types/compliance'
import { toISODate } from './date'

export const seedClients: Client[] = [
  { id: 'c1', companyName: 'Aster Motors Pvt Ltd', country: 'India', entityType: 'Private Limited' },
  { id: 'c2', companyName: 'Northwind Analytics LLC', country: 'United States', entityType: 'LLC' },
  { id: 'c3', companyName: 'Bluefin Retail Pte', country: 'Singapore', entityType: 'Pte Ltd' },
]

const today = new Date()

export const seedTasks: ComplianceTask[] = [
  {
    id: 't1',
    clientId: 'c1',
    title: 'GST Monthly Return',
    description: 'File GSTR-3B for current month',
    category: 'Tax',
    dueDate: toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 't2',
    clientId: 'c1',
    title: 'TDS Payment',
    description: 'Deposit deducted TDS',
    category: 'Payroll',
    dueDate: toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
    status: 'In Progress',
    priority: 'Medium',
  },
  {
    id: 't3',
    clientId: 'c2',
    title: 'Quarterly Sales Tax Filing',
    description: 'Submit state sales tax return',
    category: 'Filing',
    dueDate: toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)),
    status: 'Pending',
    priority: 'High',
  },
  {
    id: 't4',
    clientId: 'c3',
    title: 'Annual Financial Statement',
    description: 'Prepare statement for regulator submission',
    category: 'Audit',
    dueDate: toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)),
    status: 'Completed',
    priority: 'Low',
  },
]
