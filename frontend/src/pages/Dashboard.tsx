import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Layout,
  Menu,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Spin,
  Alert,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Tag,
  Space,
  message,
  Flex
} from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  FolderOpenOutlined,
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
  GlobalOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { useGetStatsQuery } from '../store/statsSlice';
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from '../store/ordersSlice';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../store/productsSlice';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../store/categoriesSlice';
import { useGetBuyersQuery } from '../store/buyersSlice';
import { useGetAdminNewsQuery, useCreateNewsMutation, useUpdateNewsMutation, useDeleteNewsMutation } from '../store/newsSlice';
import { SYSTEM_MESSAGES } from '../constants/messages';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Zod Validation Schemas
const productSchema = z.object({
  name: z.string().min(1, { message: 'Tên sản phẩm không được trống' }),
  price: z.preprocess((val) => Number(val), z.number().min(0, { message: 'Đơn giá phải lớn hơn hoặc bằng 0' })),
  stock: z.preprocess((val) => Number(val), z.number().int().min(0, { message: 'Số lượng kho phải là số nguyên lớn hơn hoặc bằng 0' })),
  description: z.string().optional().default(''),
  category_id: z.preprocess((val) => Number(val), z.number().min(1, { message: 'Vui lòng chọn danh mục' })),
  image_url: z.string().url({ message: 'Đường dẫn ảnh phải là link URL hợp lệ' }).or(z.literal('')),
});

const categorySchema = z.object({
  name: z.string().min(1, { message: 'Tên danh mục không được trống' }),
  image_url: z.string().url({ message: 'Đường dẫn ảnh phải là link URL hợp lệ' }).or(z.literal('')),
});

type ProductFormFields = z.infer<typeof productSchema>;
type CategoryFormFields = z.infer<typeof categorySchema>;

const newsSchema = z.object({
  title: z.string().min(1, { message: 'Tiêu đề không được trống' }),
  author: z.string().min(1, { message: 'Tên tác giả không được trống' }),
  summary: z.string().optional().default(''),
  content: z.string().min(1, { message: 'Nội dung bài viết không được trống' }),
  image_url: z.string().url({ message: 'Đường dẫn ảnh phải là link URL hợp lệ' }).or(z.literal('')),
});

type NewsFormFields = z.infer<typeof newsSchema>;

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Decode userRole and userPermissions from JWT token
  const token = localStorage.getItem('admin_token');
  let userRole = 'buyer';
  let userName = '';
  let userPermissions: string[] = [];

  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadJson);
        userRole = payload.claims?.role || 'buyer';
        userName = payload.claims?.name || '';
        userPermissions = payload.claims?.permissions || [];
      }
    } catch (e) {
      console.error("Failed to parse JWT token", e);
    }
  }

  const hasPermission = (permission: string) => userPermissions.includes(permission);

  // Determine active tab key based on path name
  const currentPath = location.pathname;
  let activeTabKey = hasPermission('view_stats') ? 'overview' : 'products';
  if (currentPath.includes('/products')) activeTabKey = 'products';
  else if (currentPath.includes('/categories') && hasPermission('manage_categories')) activeTabKey = 'categories';
  else if (currentPath.includes('/buyers') && hasPermission('view_buyers')) activeTabKey = 'buyers';
  else if (currentPath.includes('/orders') && hasPermission('manage_orders')) activeTabKey = 'orders';
  else if (currentPath.includes('/news') && hasPermission('manage_news')) activeTabKey = 'news';

  const isAddProduct = currentPath === '/admin/products/add';
  const isEditProduct = currentPath === '/admin/products/edit';
  const isAddCategory = currentPath === '/admin/categories/add';
  const isEditCategory = currentPath === '/admin/categories/edit';
  const isAddNews = currentPath === '/admin/news/add';
  const isEditNews = currentPath === '/admin/news/edit';

  const queryParams = new URLSearchParams(location.search);
  const editingId = Number(queryParams.get('id'));

  // Global details viewer state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // ==========================================
  // TAB COMPONENT: OVERVIEW
  // ==========================================
  const OverviewTab = () => {
    const { data: stats, isLoading: statsLoading, error: statsError } = useGetStatsQuery();
    const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useGetOrdersQuery();

    if (statsLoading || ordersLoading) return <Spin className="block my-12 mx-auto" size="large" />;
    if (statsError || ordersError) return <Alert type="error" message="Lỗi tải dữ liệu thống kê" showIcon className="my-6" />;

    return (
      <Space direction="vertical" size="large" className="w-full">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <Statistic
                title="TỔNG DOANH THU"
                value={stats?.total_revenue}
                formatter={(value) => formatPrice(Number(value))}
                valueStyle={{ color: '#1e293b', fontWeight: 900 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <Statistic
                title="ĐƠN MỚI CHỜ XỬ LÝ"
                value={stats?.pending_orders}
                valueStyle={{ color: '#d97706', fontWeight: 900 }}
                suffix="đơn"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <Statistic
                title="TỔNG SỐ ĐƠN HÀNG"
                value={stats?.total_orders}
                valueStyle={{ color: '#0f766e', fontWeight: 900 }}
                suffix="đơn"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="rounded-3xl border-slate-200 shadow-sm">
              <Statistic
                title="TỔNG SỐ SẢN PHẨM"
                value={stats?.total_products}
                valueStyle={{ color: '#4f46e5', fontWeight: 900 }}
                suffix="món"
              />
            </Card>
          </Col>
        </Row>

        <Card title="Biểu Đồ Doanh Thu Gần Đây" className="rounded-3xl border-slate-200 shadow-sm">
          {stats?.sales_data.length === 0 ? (
            <Flex justify="center" className="py-12 text-slate-400 w-full">Chưa có dữ liệu giao dịch gần đây.</Flex>
          ) : (
            <Flex align="flex-end" justify="space-between" className="h-48 pt-4 px-2 border-b border-slate-100 w-full">
              {stats?.sales_data.map((day: any, idx: number) => {
                const maxVal = Math.max(...stats.sales_data.map((d: any) => d.total), 1);
                const pct = (day.total / maxVal) * 100;
                return (
                  <Flex vertical align="center" key={idx} className="group w-full">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 mb-1 transition-all">
                      {formatPrice(day.total)}
                    </span>
                    <Flex 
                      className="w-12 bg-violet-500 rounded-t-lg group-hover:bg-violet-600 transition-all shadow-sm"
                      style={{ height: `${Math.max(pct, 8)}%` }}
                    />
                    <span className="text-[10px] font-medium text-slate-400 mt-2">
                      {day.date}
                    </span>
                  </Flex>
                );
              })}
            </Flex>
          )}
        </Card>

        <Card
          title="Đơn hàng mới nhất"
          extra={<Button type="link" onClick={() => navigate('/admin/orders')} className="font-bold text-violet-600">Xem tất cả</Button>}
          className="rounded-3xl border-slate-200 shadow-sm overflow-hidden"
          styles={{ body: { padding: 0 } }}
        >
          <Table
            dataSource={orders.slice(0, 5)}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: 'Mã đơn',
                dataIndex: 'id',
                key: 'id',
                render: (id) => <span className="font-bold">#ORD-{id}</span>
              },
              {
                title: 'Khách hàng',
                key: 'customer',
                render: (_, record) => (
                  <Flex vertical>
                    <Typography.Text className="font-semibold text-slate-800">{record.customer_name}</Typography.Text>
                    <Typography.Text className="text-xs text-slate-400 mt-0.5">{record.customer_phone}</Typography.Text>
                  </Flex>
                )
              },
              {
                title: 'Tổng tiền',
                dataIndex: 'total_amount',
                key: 'total_amount',
                render: (amount) => <span className="font-bold">{formatPrice(amount)}</span>
              },
              {
                title: 'Thanh toán',
                dataIndex: 'payment_method',
                key: 'payment_method',
                render: (method) => <Tag color="blue">{method}</Tag>
              },
              {
                title: 'Trạng thái',
                dataIndex: 'status',
                key: 'status',
                render: (status) => (
                  <Tag color={
                    status === 'Pending' ? 'orange' :
                    status === 'Processing' ? 'blue' :
                    status === 'Completed' ? 'green' : 'default'
                  }>
                    {status === 'Pending' && 'Chờ xử lý'}
                    {status === 'Processing' && 'Đang đóng gói'}
                    {status === 'Completed' && 'Đã hoàn thành'}
                    {status === 'Cancelled' && 'Đã hủy'}
                  </Tag>
                )
              }
            ]}
          />
        </Card>
      </Space>
    );
  };

  // ==========================================
  // TAB COMPONENT: PRODUCTS LIST
  // ==========================================
  const ProductsTab = () => {
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { data: products = [], isLoading, isFetching, error } = useGetProductsQuery({ search: debouncedSearch });
    const [deleteProduct] = useDeleteProductMutation();

    useEffect(() => {
      const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
      return () => clearTimeout(timer);
    }, [searchInput]);

    const handleDelete = async (id: number) => {
      try {
        const res = await deleteProduct(id).unwrap();
        message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
      } catch (err: any) {
        message.error(err.data?.message || SYSTEM_MESSAGES.ERROR);
      }
    };

    if (isLoading) return <Spin className="block my-12 mx-auto" size="large" />;
    if (error) return <Alert type="error" message="Lỗi tải danh sách sản phẩm" showIcon className="my-6" />;

    return (
      <Space direction="vertical" size="large" className="w-full">
        <Flex justify="space-between" align="center" className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm w-full">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            loading={isFetching}
            style={{ width: 300 }}
            allowClear
          />
          {hasPermission('create_products') && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/products/add')}
              className="bg-violet-600 border-none font-bold rounded-xl"
              style={{ backgroundColor: '#7c3aed' }}
            >
              Thêm sản phẩm mới
            </Button>
          )}
        </Flex>

        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={products}
            loading={isFetching}
            rowKey="id"
            columns={[
              {
                title: 'Hình ảnh',
                dataIndex: 'image_url',
                key: 'image_url',
                render: (url, record) => <img src={url} alt={record.name} className="w-12 h-12 object-cover rounded-xl border" />
              },
              {
                title: 'Tên sản phẩm',
                dataIndex: 'name',
                key: 'name',
                render: (name, record) => (
                  <Flex vertical>
                    <Typography.Text className="font-bold text-slate-800">{name}</Typography.Text>
                    <Typography.Text className="text-xs text-slate-400 mt-1 truncate max-w-xs">{record.description || 'Chưa có mô tả'}</Typography.Text>
                  </Flex>
                )
              },
              {
                title: 'Danh mục',
                dataIndex: ['category', 'name'],
                key: 'category_name',
                render: (catName) => <span className="text-slate-600 font-semibold">{catName || 'Không xác định'}</span>
              },
              {
                title: 'Đơn giá',
                dataIndex: 'price',
                key: 'price',
                render: (price) => <span className="font-bold text-slate-900">{formatPrice(price)}</span>
              },
              {
                title: 'Kho hàng',
                dataIndex: 'stock',
                key: 'stock',
                render: (stock) => (
                  <span className={`font-bold ${stock <= 5 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {stock} món
                  </span>
                )
              },
              {
                title: 'Hành động',
                key: 'actions',
                align: 'right',
                render: (_, record) => (
                  <Space>
                    <Button
                      type="text"
                      onClick={() => navigate(`/admin/products/edit?id=${record.id}`)}
                      className="text-violet-600 hover:bg-violet-50 font-bold rounded-lg"
                    >
                      Sửa
                    </Button>
                    {hasPermission('delete_products') && (
                      <Popconfirm
                        title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                        okText="Đồng ý"
                        cancelText="Hủy bỏ"
                        onConfirm={() => handleDelete(record.id)}
                      >
                        <Button type="text" danger className="font-bold rounded-lg">
                          Xóa
                        </Button>
                      </Popconfirm>
                    )}
                  </Space>
                )
              }
            ]}
          />
        </Card>
      </Space>
    );
  };

  // ==========================================
  // TAB COMPONENT: PRODUCT ADD/EDIT FORM
  // ==========================================
  const ProductFormTab = () => {
    const isEdit = location.pathname.includes('/edit');
    const { data: products = [] } = useGetProductsQuery();
    const { data: categories = [] } = useGetCategoriesQuery();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors }
    } = useForm<ProductFormFields>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        name: '',
        price: 0,
        stock: 0,
        description: '',
        category_id: 0,
        image_url: ''
      }
    });

    useEffect(() => {
      if (isEdit && editingId && products.length > 0) {
        const prod = products.find(p => p.id === editingId);
        if (prod) {
          reset({
            name: prod.name,
            price: prod.price,
            stock: prod.stock,
            description: prod.description || '',
            category_id: prod.category_id,
            image_url: prod.image_url || ''
          });
        }
      } else if (!isEdit && categories.length > 0) {
        reset({
          name: '',
          price: 0,
          stock: 0,
          description: '',
          category_id: categories[0]?.id || 0,
          image_url: ''
        });
      }
    }, [isEdit, editingId, products, categories, reset]);

    const onSubmit = async (data: ProductFormFields) => {
      try {
        if (isEdit && editingId) {
          const res = await updateProduct({ id: editingId, data }).unwrap();
          message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
        } else {
          const res = await createProduct(data).unwrap();
          message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
        }
        navigate('/admin/products');
      } catch (err: any) {
        message.error(err.data?.message || SYSTEM_MESSAGES.ERROR);
      }
    };

    return (
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/products')} type="text" />
            <span className="font-bold">{isEdit ? 'Chỉnh sửa thông tin sản phẩm' : 'Thêm sản phẩm mới'}</span>
          </Space>
        }
        className="max-w-2xl rounded-3xl border-slate-200 shadow-sm"
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          
          <Form.Item
            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tên sản phẩm</span>}
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ví dụ: Laptop MacBook Air M3" className="rounded-xl" />
              )}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Đơn giá (VND)</span>}
                validateStatus={errors.price ? 'error' : ''}
                help={errors.price?.message}
              >
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="number" className="rounded-xl" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Số lượng kho</span>}
                validateStatus={errors.stock ? 'error' : ''}
                help={errors.stock?.message}
              >
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="number" className="rounded-xl" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Danh mục sản phẩm</span>}
            validateStatus={errors.category_id ? 'error' : ''}
            help={errors.category_id?.message}
          >
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select {...field} className="rounded-xl w-full">
                  {categories.map(cat => (
                    <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Đường dẫn ảnh sản phẩm (Link URL)</span>}
            validateStatus={errors.image_url ? 'error' : ''}
            help={errors.image_url?.message}
          >
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://images.unsplash.com/..." className="rounded-xl" />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Mô tả chi tiết</span>}
            validateStatus={errors.description ? 'error' : ''}
            help={errors.description?.message}
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} rows={5} placeholder="Nhập thông số kỹ thuật, mô tả chi tiết sản phẩm..." className="rounded-xl" />
              )}
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => navigate('/admin/products')} className="rounded-xl">Hủy bỏ</Button>
              <Button type="primary" htmlType="submit" className="bg-violet-600 border-none font-bold rounded-xl" style={{ backgroundColor: '#7c3aed' }}>
                Lưu sản phẩm
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    );
  };

  // ==========================================
  // TAB COMPONENT: CATEGORIES LIST
  // ==========================================
  const CategoriesTab = () => {
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { data: categories = [], isLoading, isFetching, error } = useGetCategoriesQuery({ search: debouncedSearch });
    const [deleteCategory] = useDeleteCategoryMutation();

    useEffect(() => {
      const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
      return () => clearTimeout(timer);
    }, [searchInput]);

    const handleDelete = async (id: number) => {
      try {
        const res = await deleteCategory(id).unwrap();
        message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
      } catch (err: any) {
        message.error(err.data?.message || SYSTEM_MESSAGES.ERROR);
      }
    };

    if (isLoading) return <Spin className="block my-12 mx-auto" size="large" />;
    if (error) return <Alert type="error" message="Lỗi tải danh mục sản phẩm" showIcon className="my-6" />;

    return (
      <Space direction="vertical" size="large" className="w-full">
        <Flex justify="space-between" align="center" className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm w-full">
          <Input.Search
            placeholder="Tìm kiếm danh mục..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            loading={isFetching}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/categories/add')}
            className="bg-violet-600 border-none font-bold rounded-xl"
            style={{ backgroundColor: '#7c3aed' }}
          >
            Thêm danh mục mới
          </Button>
        </Flex>

        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={categories}
            loading={isFetching}
            rowKey="id"
            columns={[
              {
                title: 'Ảnh đại diện',
                dataIndex: 'image_url',
                key: 'image_url',
                render: (url, record) => <img src={url} alt={record.name} className="w-12 h-12 object-cover rounded-xl border" />
              },
              {
                title: 'Tên danh mục',
                dataIndex: 'name',
                key: 'name',
                render: (name) => <span className="font-bold text-slate-800">{name}</span>
              },
              {
                title: 'Đường dẫn thân thiện (Slug)',
                dataIndex: 'slug',
                key: 'slug',
                render: (slug) => <span className="text-slate-500 font-semibold">{slug}</span>
              },
              {
                title: 'Số sản phẩm',
                dataIndex: 'products_count',
                key: 'products_count',
                render: (count) => <span className="font-bold text-slate-700">{count ?? 0} món</span>
              },
              {
                title: 'Hành động',
                key: 'actions',
                align: 'right',
                render: (_, record) => (
                  <Space>
                    <Button
                      type="text"
                      onClick={() => navigate(`/admin/categories/edit?id=${record.id}`)}
                      className="text-violet-600 hover:bg-violet-50 font-bold rounded-lg"
                    >
                      Sửa
                    </Button>
                    <Popconfirm
                      title="CẢNH BÁO: Xóa danh mục sẽ xóa toàn bộ sản phẩm thuộc danh mục này! Tiếp tục?"
                      okText="Đồng ý xóa"
                      cancelText="Hủy bỏ"
                      onConfirm={() => handleDelete(record.id)}
                    >
                      <Button type="text" danger className="font-bold rounded-lg">
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                )
              }
            ]}
          />
        </Card>
      </Space>
    );
  };

  // ==========================================
  // TAB COMPONENT: CATEGORY ADD/EDIT FORM
  // ==========================================
  const CategoryFormTab = () => {
    const isEdit = location.pathname.includes('/edit');
    const { data: categories = [] } = useGetCategoriesQuery();
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors }
    } = useForm<CategoryFormFields>({
      resolver: zodResolver(categorySchema),
      defaultValues: {
        name: '',
        image_url: ''
      }
    });

    useEffect(() => {
      if (isEdit && editingId && categories.length > 0) {
        const cat = categories.find(c => c.id === editingId);
        if (cat) {
          reset({
            name: cat.name,
            image_url: cat.image_url || ''
          });
        }
      } else if (!isEdit) {
        reset({
          name: '',
          image_url: ''
        });
      }
    }, [isEdit, editingId, categories, reset]);

    const onSubmit = async (data: CategoryFormFields) => {
      try {
        if (isEdit && editingId) {
          const res = await updateCategory({ id: editingId, data }).unwrap();
          message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
        } else {
          const res = await createCategory(data).unwrap();
          message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
        }
        navigate('/admin/categories');
      } catch (err: any) {
        message.error(err.data?.message || SYSTEM_MESSAGES.ERROR);
      }
    };

    return (
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/categories')} type="text" />
            <span className="font-bold">{isEdit ? 'Chỉnh sửa thông tin danh mục' : 'Thêm danh mục mới'}</span>
          </Space>
        }
        className="max-w-xl rounded-3xl border-slate-200 shadow-sm"
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          
          <Form.Item
            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tên danh mục</span>}
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ví dụ: Phụ kiện điện thoại, Đồ gia dụng..." className="rounded-xl" />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Đường dẫn ảnh đại diện (Link URL)</span>}
            validateStatus={errors.image_url ? 'error' : ''}
            help={errors.image_url?.message}
          >
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://images.unsplash.com/..." className="rounded-xl" />
              )}
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => navigate('/admin/categories')} className="rounded-xl">Hủy bỏ</Button>
              <Button type="primary" htmlType="submit" className="bg-violet-600 border-none font-bold rounded-xl" style={{ backgroundColor: '#7c3aed' }}>
                Lưu danh mục
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    );
  };

  // ==========================================
  // TAB COMPONENT: NEWS LIST
  // ==========================================
  const NewsTab = () => {
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { data: news = [], isLoading, isFetching, error } = useGetAdminNewsQuery({ search: debouncedSearch });
    const [deleteNews] = useDeleteNewsMutation();

    useEffect(() => {
      const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
      return () => clearTimeout(timer);
    }, [searchInput]);

    const handleDelete = async (id: number) => {
      try {
        const res = await deleteNews(id).unwrap();
        message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
      } catch (err: any) {
        message.error(err.data?.message || SYSTEM_MESSAGES.ERROR);
      }
    };

    if (isLoading) return <Spin className="block my-12 mx-auto" size="large" />;
    if (error) return <Alert type="error" message="Lỗi tải danh sách tin tức" showIcon className="my-6" />;

    return (
      <Space direction="vertical" size="large" className="w-full">
        <Flex justify="space-between" align="center" className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm w-full">
          <Input.Search
            placeholder="Tìm kiếm bài viết..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            loading={isFetching}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/news/add')}
            className="bg-violet-600 border-none font-bold rounded-xl"
            style={{ backgroundColor: '#7c3aed' }}
          >
            Thêm bài viết mới
          </Button>
        </Flex>

        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={news}
            loading={isFetching}
            rowKey="id"
            columns={[
              {
                title: 'Ảnh đại diện',
                dataIndex: 'image_url',
                key: 'image_url',
                render: (url, record) => <img src={url} alt={record.title} className="w-16 h-10 object-cover rounded-lg border" />
              },
              {
                title: 'Tiêu đề',
                dataIndex: 'title',
                key: 'title',
                render: (title) => <span className="font-bold text-slate-800">{title}</span>
              },
              {
                title: 'Tác giả',
                dataIndex: 'author',
                key: 'author',
                render: (author) => <span className="font-semibold text-slate-650">{author}</span>
              },
              {
                title: 'Ngày tạo',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (date) => <span className="text-slate-500 font-semibold">{new Date(date).toLocaleDateString('vi-VN')}</span>
              },
              {
                title: 'Hành động',
                key: 'actions',
                align: 'right',
                render: (_, record) => (
                  <Space>
                    <Button
                      type="text"
                      onClick={() => navigate(`/admin/news/edit?id=${record.id}`)}
                      className="text-violet-600 hover:bg-violet-50 font-bold rounded-lg"
                    >
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa bài viết này?"
                      okText="Xóa ngay"
                      cancelText="Hủy bỏ"
                      onConfirm={() => handleDelete(record.id)}
                    >
                      <Button type="text" danger className="font-bold rounded-lg">
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                )
              }
            ]}
          />
        </Card>
      </Space>
    );
  };

  // ==========================================
  // TAB COMPONENT: NEWS ADD/EDIT FORM
  // ==========================================
  const NewsFormTab = () => {
    const isEdit = location.pathname.includes('/edit');
    const { data: news = [] } = useGetAdminNewsQuery();
    const [createNews] = useCreateNewsMutation();
    const [updateNews] = useUpdateNewsMutation();

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors }
    } = useForm<NewsFormFields>({
      resolver: zodResolver(newsSchema),
      defaultValues: {
        title: '',
        author: 'Ban biên tập',
        summary: '',
        content: '',
        image_url: ''
      }
    });

    useEffect(() => {
      if (isEdit && editingId && news.length > 0) {
        const article = news.find(n => n.id === editingId);
        if (article) {
          reset({
            title: article.title,
            author: article.author || 'Ban biên tập',
            summary: article.summary || '',
            content: article.content,
            image_url: article.image_url || ''
          });
        }
      } else if (!isEdit) {
        reset({
          title: '',
          author: 'Ban biên tập',
          summary: '',
          content: '',
          image_url: ''
        });
      }
    }, [isEdit, editingId, news, reset]);

    const onSubmit = async (data: NewsFormFields) => {
      try {
        if (isEdit && editingId) {
          const res = await updateNews({ id: editingId, data }).unwrap();
          message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
        } else {
          const res = await createNews(data).unwrap();
          message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
        }
        navigate('/admin/news');
      } catch (err: any) {
        message.error(err.data?.message || SYSTEM_MESSAGES.ERROR);
      }
    };

    return (
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/news')} type="text" />
            <span className="font-bold">{isEdit ? 'Chỉnh sửa thông tin bài viết' : 'Thêm bài viết mới'}</span>
          </Space>
        }
        className="max-w-3xl rounded-3xl border-slate-200 shadow-sm"
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tiêu đề bài viết</span>}
                validateStatus={errors.title ? 'error' : ''}
                help={errors.title?.message}
              >
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Nhập tiêu đề hấp dẫn..." className="rounded-xl" />
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tác giả</span>}
                validateStatus={errors.author ? 'error' : ''}
                help={errors.author?.message}
              >
                <Controller
                  name="author"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Ví dụ: Xuân Trường..." className="rounded-xl" />
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Đường dẫn ảnh đại diện (Cover Image URL)</span>}
            validateStatus={errors.image_url ? 'error' : ''}
            help={errors.image_url?.message}
          >
            <Controller
              name="image_url"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="https://images.unsplash.com/..." className="rounded-xl" />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tóm tắt ngắn (Summary)</span>}
            validateStatus={errors.summary ? 'error' : ''}
            help={errors.summary?.message}
          >
            <Controller
              name="summary"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} rows={3} placeholder="Mô tả ngắn gọn nội dung bài viết..." className="rounded-xl" />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Nội dung chi tiết (HTML hỗ trợ)</span>}
            validateStatus={errors.content ? 'error' : ''}
            help={errors.content?.message}
          >
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <Input.TextArea {...field} rows={12} placeholder="Nội dung bài viết, sử dụng thẻ HTML nếu cần thiết..." className="rounded-xl" />
              )}
            />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => navigate('/admin/news')} className="rounded-xl">Hủy bỏ</Button>
              <Button type="primary" htmlType="submit" className="bg-violet-600 border-none font-bold rounded-xl" style={{ backgroundColor: '#7c3aed' }}>
                Lưu bài viết
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    );
  };

  // ==========================================
  // TAB COMPONENT: BUYERS
  // ==========================================
  const BuyersTab = () => {
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { data: buyers = [], isLoading, isFetching, error } = useGetBuyersQuery({ search: debouncedSearch });

    useEffect(() => {
      const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
      return () => clearTimeout(timer);
    }, [searchInput]);

    if (isLoading) return <Spin className="block my-12 mx-auto" size="large" />;
    if (error) return <Alert type="error" message="Lỗi tải dữ liệu khách hàng" showIcon className="my-6" />;

    return (
      <Space direction="vertical" size="large" className="w-full">
        <Flex justify="space-between" align="center" className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm w-full">
          <Text type="secondary" className="text-sm font-semibold">Khách hàng đăng ký đặt mua sản phẩm</Text>
          <Input.Search
            placeholder="Tìm kiếm khách hàng theo tên hoặc SĐT..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            loading={isFetching}
            style={{ width: 350 }}
            allowClear
          />
        </Flex>

        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={buyers}
            loading={isFetching}
            rowKey="id"
            columns={[
              {
                title: 'Mã khách hàng',
                dataIndex: 'id',
                key: 'id',
                render: (id) => <span className="font-bold">#USR-{id}</span>
              },
              {
                title: 'Họ và tên',
                dataIndex: 'name',
                key: 'name',
                render: (name) => <span className="font-semibold text-slate-800">{name}</span>
              },
              {
                title: 'SĐT / Tài khoản',
                dataIndex: 'phone',
                key: 'phone',
                render: (phone) => <span className="font-bold text-violet-600">{phone}</span>
              },
              {
                title: 'Mật khẩu mặc định',
                key: 'default_password',
                render: () => <Text code>a12345</Text>
              },
              {
                title: 'Ngày đăng ký',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (date) => <span className="text-slate-500">{date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}</span>
              },
              {
                title: 'Số đơn đã mua',
                dataIndex: 'orders_count',
                key: 'orders_count',
                render: (count) => <span className="font-bold text-slate-800">{count} đơn</span>
              },
              {
                title: 'Tổng chi tiêu',
                dataIndex: 'total_spent',
                key: 'total_spent',
                render: (spent) => <span className="font-black text-emerald-600">{formatPrice(spent)}</span>
              }
            ]}
          />
        </Card>
      </Space>
    );
  };

  // ==========================================
  // TAB COMPONENT: ORDERS
  // ==========================================
  const OrdersTab = () => {
    const [searchInput, setSearchInput] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const { data: orders = [], isLoading, isFetching, error } = useGetOrdersQuery({ search: debouncedSearch });
    const [updateOrderStatus] = useUpdateOrderStatusMutation();

    useEffect(() => {
      const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
      return () => clearTimeout(timer);
    }, [searchInput]);

    const handleStatusChange = async (orderId: number, status: string) => {
      try {
        const res = await updateOrderStatus({ id: orderId, status }).unwrap();
        message.success(res?.message || SYSTEM_MESSAGES.SUCCESS);
      } catch (err: any) {
        message.error(err.data?.message || SYSTEM_MESSAGES.ERROR);
      }
    };

    if (isLoading) return <Spin className="block my-12 mx-auto" size="large" />;
    if (error) return <Alert type="error" message="Lỗi tải danh sách đơn hàng" showIcon className="my-6" />;

    return (
      <Space direction="vertical" size="large" className="w-full">
        <Flex justify="space-between" align="center" className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm w-full">
          <Text type="secondary" className="text-sm font-semibold">Xem thông tin và quản lý trạng thái đơn hàng</Text>
          <Input.Search
            placeholder="Tìm kiếm theo mã đơn, tên hoặc SĐT..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            loading={isFetching}
            style={{ width: 350 }}
            allowClear
          />
        </Flex>

        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
          <Table
            dataSource={orders}
            loading={isFetching}
            rowKey="id"
            columns={[
              {
                title: 'Mã đơn',
                dataIndex: 'id',
                key: 'id',
                render: (id) => <span className="font-bold">#ORD-{id}</span>
              },
              {
                title: 'Khách hàng',
                key: 'customer',
                render: (_, record) => (
                  <Flex vertical>
                    <Typography.Text className="font-semibold text-slate-800">{record.customer_name}</Typography.Text>
                    <Typography.Text className="text-xs text-slate-400 mt-0.5">{record.customer_phone}</Typography.Text>
                  </Flex>
                )
              },
              {
                title: 'Tổng tiền',
                dataIndex: 'total_amount',
                key: 'total_amount',
                render: (amount) => <span className="font-bold text-slate-900">{formatPrice(amount)}</span>
              },
              {
                title: 'Thanh toán',
                dataIndex: 'payment_method',
                key: 'payment_method',
                render: (method) => <Tag color="blue">{method}</Tag>
              },
              {
                title: 'Ngày đặt hàng',
                dataIndex: 'created_at',
                key: 'created_at',
                render: (date) => <span className="text-slate-500 text-xs">{new Date(date).toLocaleString('vi-VN')}</span>
              },
              {
                title: 'Trạng thái giao hàng',
                dataIndex: 'status',
                key: 'status',
                render: (status, record) => (
                  <Select
                    value={status}
                    onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
                    className="text-xs font-bold w-48"
                    dropdownClassName="text-xs"
                  >
                    <Select.Option value="Pending">Chờ xử lý (COD / Chờ CK)</Select.Option>
                    <Select.Option value="Processing">Đang đóng gói & giao hàng</Select.Option>
                    <Select.Option value="Completed">Đã hoàn thành</Select.Option>
                    <Select.Option value="Cancelled">Đã hủy đơn</Select.Option>
                  </Select>
                )
              },
              {
                title: 'Hành động',
                key: 'actions',
                align: 'right',
                render: (_, record) => (
                  <Button
                    type="text"
                    onClick={() => setSelectedOrder(record)}
                    className="text-violet-600 hover:bg-violet-50 font-bold rounded-lg"
                  >
                    Xem chi tiết
                  </Button>
                )
              }
            ]}
          />
        </Card>
      </Space>
    );
  };

  return (
    <Layout className="min-h-screen">
      
      {/* LEFT SIDEBAR */}
      <Sider width={260} className="bg-slate-900 shadow-lg" breakpoint="lg" style={{ minHeight: '100vh', position: 'relative' }}>
        <Flex align="center" className="h-16 px-6 bg-slate-950 border-b border-slate-800 w-full">
          <span className="text-lg font-black text-white tracking-wider flex items-center gap-2">
            <span className="bg-violet-600 text-white rounded p-1 text-xs">LX</span>
            LX Store <span className="text-[10px] text-violet-400 font-bold border border-violet-800 px-1.5 py-0.5 rounded">ADMIN</span>
          </span>
        </Flex>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeTabKey]}
          className="mt-6 bg-slate-900 border-none px-2 space-y-1"
          items={[
            hasPermission('view_stats') && {
              key: 'overview',
              icon: <DashboardOutlined />,
              label: 'Tổng quan',
              onClick: () => navigate('/admin/overview')
            },
            hasPermission('view_products') && {
              key: 'products',
              icon: <ShoppingOutlined />,
              label: 'Sản phẩm',
              onClick: () => navigate('/admin/products')
            },
            hasPermission('manage_categories') && {
              key: 'categories',
              icon: <FolderOpenOutlined />,
              label: 'Danh mục',
              onClick: () => navigate('/admin/categories')
            },
            hasPermission('view_buyers') && {
              key: 'buyers',
              icon: <UserOutlined />,
              label: 'Người mua',
              onClick: () => navigate('/admin/buyers')
            },
            hasPermission('manage_orders') && {
              key: 'orders',
              icon: <FileTextOutlined />,
              label: 'Đơn hàng',
              onClick: () => navigate('/admin/orders')
            },
            hasPermission('manage_news') && {
              key: 'news',
              icon: <ReadOutlined />,
              label: 'Tin tức',
              onClick: () => navigate('/admin/news')
            }
          ].filter(Boolean) as any}
        />

        <Flex vertical gap={8} className="absolute bottom-0 w-full p-4 bg-slate-950 border-t border-slate-850">
          <a
            href="http://127.0.0.1:8000"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-xl text-xs font-bold transition-all no-underline"
            target="_blank"
            rel="noreferrer"
          >
            <GlobalOutlined /> Xem cửa hàng (Public)
          </a>

          <Button
            type="text"
            danger
            block
            icon={<LogoutOutlined />}
            onClick={onLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 hover:text-rose-100 rounded-xl text-xs font-bold transition-all border border-rose-900/50"
          >
            Đăng xuất
          </Button>
        </Flex>
      </Sider>

      {/* RIGHT MAIN CONTENT */}
      <Layout>
        <Header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 32px' }} className="flex items-center justify-between shadow-sm h-16">
          <Title level={3} style={{ margin: 0, fontWeight: 900, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '-0.025em' }}>
            {activeTabKey === 'overview' && 'Bảng Điều Khiển Tổng Quan'}
            {activeTabKey === 'products' && (
              isAddProduct ? 'Thêm Sản Phẩm Mới' : isEditProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Danh Sách Sản Phẩm'
            )}
            {activeTabKey === 'categories' && (
              isAddCategory ? 'Thêm Danh Mục Mới' : isEditCategory ? 'Chỉnh Sửa Danh Mục' : 'Danh Mục Sản Phẩm'
            )}
            {activeTabKey === 'buyers' && 'Danh Sách Người Mua'}
            {activeTabKey === 'orders' && 'Quản Lý Đơn Hàng'}
            {activeTabKey === 'news' && (
              isAddNews ? 'Thêm Bài Viết Mới' : isEditNews ? 'Chỉnh Sửa Bài Viết' : 'Quản Lý Tin Tức'
            )}
          </Title>
          <Space size="middle">
            <Text type="secondary" className="text-xs font-semibold bg-slate-100 px-3 py-1 rounded-full uppercase">
              Quyền: {userRole}
            </Text>
            {userName && (
              <Text className="text-xs font-bold text-slate-700">
                Xin chào, {userName}
              </Text>
            )}
          </Space>
        </Header>

        <Content className="p-8 overflow-y-auto" style={{ backgroundColor: '#f8fafc' }}>
          <Routes>
            {hasPermission('view_stats') && <Route path="overview" element={<OverviewTab />} />}
            {hasPermission('view_products') && <Route path="products" element={<ProductsTab />} />}
            {hasPermission('create_products') && <Route path="products/add" element={<ProductFormTab />} />}
            {hasPermission('edit_products') && <Route path="products/edit" element={<ProductFormTab />} />}
            {hasPermission('manage_categories') && (
              <>
                <Route path="categories" element={<CategoriesTab />} />
                <Route path="categories/add" element={<CategoryFormTab />} />
                <Route path="categories/edit" element={<CategoryFormTab />} />
              </>
            )}
            {hasPermission('view_buyers') && <Route path="buyers" element={<BuyersTab />} />}
            {hasPermission('manage_orders') && <Route path="orders" element={<OrdersTab />} />}
            {hasPermission('manage_news') && (
              <>
                <Route path="news" element={<NewsTab />} />
                <Route path="news/add" element={<NewsFormTab />} />
                <Route path="news/edit" element={<NewsFormTab />} />
              </>
            )}
            
            <Route 
              path="*" 
              element={
                <Navigate 
                  to={
                    hasPermission('view_stats') 
                      ? 'overview' 
                      : hasPermission('view_products') 
                        ? 'products' 
                        : '/admin/products'
                  } 
                  replace 
                />
              } 
            />
          </Routes>
        </Content>
      </Layout>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <Modal
          title={<span className="font-extrabold text-slate-800">Chi Tiết Hóa Đơn #ORD-{selectedOrder.id}</span>}
          open={!!selectedOrder}
          onCancel={() => setSelectedOrder(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedOrder(null)} className="rounded-xl">
              Đóng lại
            </Button>
          ]}
          width={650}
        >
          <Space direction="vertical" size="large" className="w-full pt-4">
            <Row gutter={[24, 24]} className="bg-slate-50 p-4 rounded-2xl border w-full">
              <Col xs={24} sm={12}>
                <Text type="secondary" className="text-xs font-bold uppercase tracking-wide block mb-2">Thông tin khách hàng</Text>
                <Typography.Text className="font-semibold text-sm text-slate-800 block">{selectedOrder.customer_name}</Typography.Text>
                <Typography.Text className="text-xs text-slate-500 mt-1 block">SĐT: <span className="font-bold text-violet-600">{selectedOrder.customer_phone}</span></Typography.Text>
                <Typography.Text className="text-xs text-slate-500 mt-1 block">Mật khẩu mặc định: <span className="font-semibold">`a12345`</span></Typography.Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text type="secondary" className="text-xs font-bold uppercase tracking-wide block mb-2">Hình thức & Vận chuyển</Text>
                <Typography.Text className="text-xs text-slate-650 block">Hình thức: <span className="font-semibold">{selectedOrder.payment_method}</span></Typography.Text>
                <Typography.Text className="text-xs text-slate-650 mt-1 block">Trạng thái: <span className="font-semibold">{selectedOrder.status}</span></Typography.Text>
                <Typography.Text className="text-xs text-slate-650 mt-1 block">Địa chỉ nhận: <span className="font-semibold">{selectedOrder.shipping_address}</span></Typography.Text>
              </Col>
            </Row>

            <Flex vertical className="w-full">
              <Text type="secondary" className="text-xs font-bold uppercase tracking-wide block mb-2">Sản phẩm đã mua</Text>
              <Table
                dataSource={selectedOrder.items}
                rowKey={(_: any, idx?: number) => idx || 0}
                pagination={false}
                size="small"
                className="border rounded-2xl overflow-hidden"
                columns={[
                  {
                    title: 'Tên sản phẩm',
                    dataIndex: ['product', 'name'],
                    key: 'product_name',
                    render: (name: string) => <span className="font-semibold text-slate-800">{name || 'Sản phẩm đã xóa'}</span>
                  },
                  {
                    title: 'Đơn giá',
                    dataIndex: 'price',
                    key: 'price',
                    align: 'center',
                    render: (price: number) => <span className="text-slate-700 font-medium">{formatPrice(price)}</span>
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    align: 'center',
                    render: (qty: number) => <span className="font-bold text-slate-800">{qty} món</span>
                  },
                  {
                    title: 'Thành tiền',
                    key: 'item_total',
                    align: 'right',
                    render: (_: any, record: any) => <span className="font-bold text-slate-900">{formatPrice(record.price * record.quantity)}</span>
                  }
                ]}
              />
            </Flex>

            <Flex justify="space-between" align="center" className="bg-violet-50 p-4 rounded-2xl border border-violet-100 w-full">
              <span className="text-sm font-bold text-violet-800">TỔNG TIỀN THANH TOÁN:</span>
              <span className="text-lg font-black text-violet-900">{formatPrice(selectedOrder.total_amount)}</span>
            </Flex>
          </Space>
        </Modal>
      )}

    </Layout>
  );
};

export default Dashboard;
