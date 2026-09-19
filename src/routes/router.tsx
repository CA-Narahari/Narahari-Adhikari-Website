import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

// Layouts
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'

// Public Pages
import Home from '@/pages/public/Home'
import About from '@/pages/public/About'
import Team from '@/pages/public/Team'
import Message from '@/pages/public/Message'
import Network from '@/pages/public/Network'
import Services from '@/pages/public/Services'
import ServiceDetail from '@/pages/public/ServiceDetail'
import Industries from '@/pages/public/Industries'
import IndustryDetail from '@/pages/public/IndustryDetail'
import Insights from '@/pages/public/Insights'
import InsightPost from '@/pages/public/InsightPost'
import Blog from '@/pages/public/Blog'
import BlogPost from '@/pages/public/BlogPost'
import News from '@/pages/public/News'
import NewsPost from '@/pages/public/NewsPost'
import Career from '@/pages/public/Career'
import CareerLife from '@/pages/public/CareerLife'
import Tools from '@/pages/public/Tools'
import EmiCalculator from '@/pages/public/EmiCalculator'
import TaxCalculator from '@/pages/public/TaxCalculator'
import VatCalculator from '@/pages/public/VatCalculator'
import Contact from '@/pages/public/Contact'
import NotFound from '@/pages/public/NotFound'

// Admin Pages
import AdminLogin from '@/pages/admin/Login'
import Dashboard from '@/pages/admin/Dashboard'
import AdminPosts from '@/pages/admin/Posts'
import AdminPostForm from '@/pages/admin/PostForm'
import AdminServices from '@/pages/admin/Services'
import AdminServiceForm from '@/pages/admin/ServiceForm'
import AdminIndustries from '@/pages/admin/Industries'
import AdminIndustryForm from '@/pages/admin/IndustryForm'
import AdminTeam from '@/pages/admin/Team'
import AdminCareers from '@/pages/admin/Careers'
import AdminInquiries from '@/pages/admin/Inquiries'
import AdminSettings from '@/pages/admin/Settings'

export const router = createBrowserRouter([
  // Public Routes wrapped in PublicLayout
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      // About Section
      { path: 'about', element: <About /> },
      { path: 'about/team', element: <Team /> },
      { path: 'about/message', element: <Message /> },
      { path: 'about/network', element: <Network /> },
      // Services Section
      { path: 'services', element: <Services /> },
      { path: 'services/:slug', element: <ServiceDetail /> },
      // Industries Section
      { path: 'industries', element: <Industries /> },
      { path: 'industries/:slug', element: <IndustryDetail /> },
      // Insights & Publications
      { path: 'insights', element: <Insights /> },
      { path: 'insights/:slug', element: <InsightPost /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'news', element: <News /> },
      { path: 'news/:slug', element: <NewsPost /> },
      // Accounting & Financial Tools (EMI, Tax, VAT)
      { path: 'tools', element: <Tools /> },
      { path: 'tools/emi-calculator', element: <EmiCalculator /> },
      { path: 'tools/tax-calculator', element: <TaxCalculator /> },
      { path: 'tools/vat-calculator', element: <VatCalculator /> },
      // Careers
      { path: 'career', element: <Career /> },
      { path: 'career/life', element: <CareerLife /> },
      // Contact
      { path: 'contact', element: <Contact /> },
      // 404 Fallback
      { path: '*', element: <NotFound /> },
    ],
  },
  // Admin Login (no sidebar)
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  // Admin Protected Routes wrapped in AdminLayout
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'posts', element: <AdminPosts /> },
      { path: 'posts/new', element: <AdminPostForm /> },
      { path: 'posts/:id/edit', element: <AdminPostForm /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'services/:id/edit', element: <AdminServiceForm /> },
      { path: 'industries', element: <AdminIndustries /> },
      { path: 'industries/:id/edit', element: <AdminIndustryForm /> },
      { path: 'team', element: <AdminTeam /> },
      { path: 'careers', element: <AdminCareers /> },
      { path: 'inquiries', element: <AdminInquiries /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
])
