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
  message
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
  ArrowLeftOutlined
} from '@ant-design/icons';
import {
  useGetStatsQuery,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetBuyersQuery
} from '../store/apiSlice';

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

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab key based on path name
  const currentPath = location.pathname;
  let activeTabKey = 'overview';
  if (currentPath.includes('/products')) activeTabKey = 'products';
  else if (currentPath.includes('/categories')) activeTabKey = 'categories';
  else if (currentPath.includes('/buyers')) activeTabKey = 'buyers';
  else if (currentPath.includes('/orders')) activeTabKey = 'orders';

  const isAddProduct = currentPath === '/admin/products/add';
  const isEditProduct = currentPath === '/admin/products/edit';
  const isAddCategory = currentPath === '/admin/categories/add';
  const isEditCategory = currentPath === '/admin/categories/edit';

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
            <div className="text-center py-12 text-slate-400">Chưa có dữ liệu giao dịch gần đây.</div>
          ) : (
            <div className="flex items-end justify-between h-48 pt-4 px-2 border-b border-slate-100">
              {stats?.sales_data.map((day: any, idx: number) => {
                const maxVal = Math.max(...stats.sales_data.map((d: any) => d.total), 1);
                const pct = (day.total / maxVal) * 100;
                return (
                  <div key={idx} className="flex flex-col items-center group w-full">
                    <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 mb-1 transition-all">
                      {formatPrice(day.total)}
                    </span>
                    <div 
                      className="w-12 bg-violet-500 rounded-t-lg group-hover:bg-violet-600 transition-all shadow-sm"
                      style={{ height: `${Math.max(pct, 8)}%` }}
                    ></div>
                    <span className="text-[10px] font-medium text-slate-400 mt-2">
                      {day.date}
                    </span>
                  </div>
                );
              })}
            </div>
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
                  <div>
                    <div className="font-semibold text-slate-800">{record.customer_name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{record.customer_phone}</div>
                  </div>
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
        await deleteProduct(id).unwrap();
        message.success('Xóa sản phẩm thành công!');
      } catch (err) {
        message.error('Lỗi khi xóa sản phẩm.');
      }
    };

    if (isLoading) return <Spin className="block my-12 mx-auto" size="large" />;
    if (error) return <Alert type="error" message="Lỗi tải danh sách sản phẩm" showIcon className="my-6" />;

    return (
      <Space direction="vertical" size="large" className="w-full">
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            loading={isFetching}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/products/add')}
            className="bg-violet-600 border-none font-bold rounded-xl"
            style={{ backgroundColor: '#7c3aed' }}
          >
            Thêm sản phẩm mới
          </Button>
        </div>

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
                  <div>
                    <div className="font-bold text-slate-800">{name}</div>
                    <div className="text-xs text-slate-400 mt-1 truncate max-w-xs">{record.description || 'Chưa có mô tả'}</div>
                  </div>
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
          await updateProduct({ id: editingId, data }).unwrap();
          message.success('Cập nhật sản phẩm thành công!');
        } else {
          await createProduct(data).unwrap();
          message.success('Thêm sản phẩm mới thành công!');
        }
        navigate('/admin/products');
      } catch (err: any) {
        message.error(err.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm.');
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
        await deleteCategory(id).unwrap();
        message.success('Xóa danh mục thành công!');
      } catch (err) {
        message.error('Lỗi khi xóa danh mục.');
      }
    };

    if (isLoading) return <Spin className="block my-12 mx-auto" size="large" />;
    if (error) return <Alert type="error" message="Lỗi tải danh mục sản phẩm" showIcon className="my-6" />;

    return (
      <Space direction="vertical" size="large" className="w-full">
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
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
        </div>

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
          await updateCategory({ id: editingId, data }).unwrap();
          message.success('Cập nhật danh mục thành công!');
        } else {
          await createCategory(data).unwrap();
          message.success('Tạo danh mục mới thành công!');
        }
        navigate('/admin/categories');
      } catch (err: any) {
        message.error(err.data?.message || 'Có lỗi xảy ra khi lưu danh mục.');
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
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <Text type="secondary" className="text-sm font-semibold">Khách hàng đăng ký đặt mua sản phẩm</Text>
          <Input.Search
            placeholder="Tìm kiếm khách hàng theo tên hoặc SĐT..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            loading={isFetching}
            style={{ width: 350 }}
            allowClear
          />
        </div>

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
        await updateOrderStatus({ id: orderId, status }).unwrap();
        message.success('Cập nhật trạng thái đơn hàng thành công!');
      } catch (err) {
        message.error('Lỗi khi cập nhật trạng thái đơn hàng.');
      }
    };

    if (isLoading) return <Spin className="block my-12 mx-auto" size="large" />;
    if (error) return <Alert type="error" message="Lỗi tải danh sách đơn hàng" showIcon className="my-6" />;

    return (
      <Space direction="vertical" size="large" className="w-full">
        <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <Text type="secondary" className="text-sm font-semibold">Xem thông tin và quản lý trạng thái đơn hàng</Text>
          <Input.Search
            placeholder="Tìm kiếm theo mã đơn, tên hoặc SĐT..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            loading={isFetching}
            style={{ width: 350 }}
            allowClear
          />
        </div>

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
                  <div>
                    <div className="font-semibold text-slate-800">{record.customer_name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{record.customer_phone}</div>
                  </div>
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
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <span className="text-lg font-black text-white tracking-wider flex items-center gap-2">
            <span className="bg-violet-600 text-white rounded p-1 text-xs">LX</span>
            LX Store <span className="text-[10px] text-violet-400 font-bold border border-violet-800 px-1.5 py-0.5 rounded">ADMIN</span>
          </span>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeTabKey]}
          className="mt-6 bg-slate-900 border-none px-2 space-y-1"
          items={[
            {
              key: 'overview',
              icon: <DashboardOutlined />,
              label: 'Tổng quan',
              onClick: () => navigate('/admin/overview')
            },
            {
              key: 'products',
              icon: <ShoppingOutlined />,
              label: 'Sản phẩm',
              onClick: () => navigate('/admin/products')
            },
            {
              key: 'categories',
              icon: <FolderOpenOutlined />,
              label: 'Danh mục',
              onClick: () => navigate('/admin/categories')
            },
            {
              key: 'buyers',
              icon: <UserOutlined />,
              label: 'Người mua',
              onClick: () => navigate('/admin/buyers')
            },
            {
              key: 'orders',
              icon: <FileTextOutlined />,
              label: 'Đơn hàng',
              onClick: () => navigate('/admin/orders')
            }
          ]}
        />

        <div className="absolute bottom-0 w-full p-4 bg-slate-950 border-t border-slate-850 space-y-2">
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
        </div>
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
          </Title>
          <Text type="secondary" className="text-xs font-semibold bg-slate-100 px-3 py-1 rounded-full">
            LX Store Admin Panel
          </Text>
        </Header>

        <Content className="p-8 overflow-y-auto" style={{ backgroundColor: '#f8fafc' }}>
          <Routes>
            <Route path="overview" element={<OverviewTab />} />
            <Route path="products" element={<ProductsTab />} />
            <Route path="products/add" element={<ProductFormTab />} />
            <Route path="products/edit" element={<ProductFormTab />} />
            <Route path="categories" element={<CategoriesTab />} />
            <Route path="categories/add" element={<CategoryFormTab />} />
            <Route path="categories/edit" element={<CategoryFormTab />} />
            <Route path="buyers" element={<BuyersTab />} />
            <Route path="orders" element={<OrdersTab />} />
            <Route path="*" element={<Navigate to="overview" replace />} />
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
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border">
              <div>
                <Text type="secondary" className="text-xs font-bold uppercase tracking-wide block mb-2">Thông tin khách hàng</Text>
                <div className="font-semibold text-sm text-slate-800">{selectedOrder.customer_name}</div>
                <div className="text-xs text-slate-500 mt-1">SĐT: <span className="font-bold text-violet-600">{selectedOrder.customer_phone}</span></div>
                <div className="text-xs text-slate-500 mt-1">Mật khẩu mặc định: <span className="font-semibold">`a12345`</span></div>
              </div>
              <div>
                <Text type="secondary" className="text-xs font-bold uppercase tracking-wide block mb-2">Hình thức & Vận chuyển</Text>
                <div className="text-xs text-slate-650">Hình thức: <span className="font-semibold">{selectedOrder.payment_method}</span></div>
                <div className="text-xs text-slate-650 mt-1">Trạng thái: <span className="font-semibold">{selectedOrder.status}</span></div>
                <div className="text-xs text-slate-650 mt-1">Địa chỉ nhận: <span className="font-semibold">{selectedOrder.shipping_address}</span></div>
              </div>
            </div>

            <div>
              <Text type="secondary" className="text-xs font-bold uppercase tracking-wide block mb-2">Sản phẩm đã mua</Text>
              <Table
                dataSource={selectedOrder.items}
                rowKey={(item, idx) => idx}
                pagination={false}
                size="small"
                className="border rounded-2xl overflow-hidden"
                columns={[
                  {
                    title: 'Tên sản phẩm',
                    dataIndex: ['product', 'name'],
                    key: 'product_name',
                    render: (name) => <span className="font-semibold text-slate-800">{name || 'Sản phẩm đã xóa'}</span>
                  },
                  {
                    title: 'Đơn giá',
                    dataIndex: 'price',
                    key: 'price',
                    align: 'center',
                    render: (price) => <span className="text-slate-700 font-medium">{formatPrice(price)}</span>
                  },
                  {
                    title: 'Số lượng',
                    dataIndex: 'quantity',
                    key: 'quantity',
                    align: 'center',
                    render: (qty) => <span className="font-bold text-slate-800">{qty} món</span>
                  },
                  {
                    title: 'Thành tiền',
                    key: 'item_total',
                    align: 'right',
                    render: (_, record) => <span className="font-bold text-slate-900">{formatPrice(record.price * record.quantity)}</span>
                  }
                ]}
              />
            </div>

            <div className="flex justify-between items-center bg-violet-50 p-4 rounded-2xl border border-violet-100">
              <span className="text-sm font-bold text-violet-800">TỔNG TIỀN THANH TOÁN:</span>
              <span className="text-lg font-black text-violet-900">{formatPrice(selectedOrder.total_amount)}</span>
            </div>
          </Space>
        </Modal>
      )}

    </Layout>
  );
};

export default Dashboard;
