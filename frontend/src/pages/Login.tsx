import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text } = Typography;

// Zod Validation Schema
const loginSchema = z.object({
  username: z.string().min(1, { message: 'Tài khoản không được để trống' }),
  password: z.string().min(1, { message: 'Mật khẩu không được để trống' }),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function Login() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFields) => {
    setLoading(true);
    setApiError(null);

    try {
      const res = await api.post('/admin/login', data);
      localStorage.setItem('admin_token', res.data.token);
      window.location.href = '/admin/overview';
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-slate-900 flex items-center justify-center p-4"
      style={{
        backgroundImage: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent 50%)',
      }}
    >
      <Card 
        bordered={false}
        className="max-w-md w-full bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-2xl"
        style={{
          backgroundColor: '#020617',
          borderColor: '#1e293b',
        }}
      >
        <div className="text-center mb-6">
          <Title level={2} style={{ color: 'white', margin: 0, fontWeight: 900 }}>
            LX Store <span className="text-xs font-semibold px-2 py-0.5 bg-violet-600 text-white rounded-md uppercase ml-1" style={{ fontSize: '12px', verticalAlign: 'middle' }}>Admin</span>
          </Title>
          <Text style={{ color: '#94a3b8' }}>Nhập thông tin quản trị viên để đăng nhập</Text>
        </div>

        {apiError && (
          <Alert
            message={apiError}
            type="error"
            showIcon
            className="mb-4 rounded-xl"
            style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.2)', color: '#fda4af' }}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          
          <Form.Item
            label={<span className="text-slate-300 font-bold uppercase text-[10px] tracking-wider">Tài khoản</span>}
            validateStatus={errors.username ? 'error' : ''}
            help={errors.username?.message}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input 
                  {...field} 
                  prefix={<UserOutlined style={{ color: '#64748b' }} />} 
                  placeholder="admin" 
                  size="large"
                  style={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    color: 'white',
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-slate-300 font-bold uppercase text-[10px] tracking-wider">Mật khẩu</span>}
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password 
                  {...field} 
                  prefix={<LockOutlined style={{ color: '#64748b' }} />} 
                  placeholder="••••••••" 
                  size="large"
                  style={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    color: 'white',
                  }}
                />
              )}
            />
          </Form.Item>

          <Form.Item className="mt-6 mb-2">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
              style={{
                backgroundColor: '#7c3aed',
                borderColor: '#7c3aed',
                height: '45px',
                borderRadius: '12px',
                fontWeight: 'bold',
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6">
          <a
            href="http://127.0.0.1:8000"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Quay lại trang chủ
          </a>
        </div>
      </Card>
    </div>
  );
}
