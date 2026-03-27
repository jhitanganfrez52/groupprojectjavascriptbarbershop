// src/pages/Users/HomeCashier.tsx
import { useState } from "react";
import 'antd/dist/reset.css';
import { Table, Modal, Form, Input, InputNumber, Select, Button, Statistic, Row, Col, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useCashier } from '../../hooks/useCashier';
import { CashRegister } from '../../types/cashRegisterSchema';

function HomeCashier() {
  const { data, loading, addMovement } = useCashier();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Tipo', dataIndex: 'type', key: 'type' },
    { title: 'Concepto', dataIndex: 'concept', key: 'concept' },
    { title: 'Monto', dataIndex: 'amount', key: 'amount' },
    { title: 'Método', dataIndex: 'method', key: 'method' },
  ];

  // Calcular resumen dinámico
  const ingresos = data.filter(d => d.type === 'income').reduce((sum, d) => sum + d.amount, 0);
  const egresos = data.filter(d => d.type === 'expense').reduce((sum, d) => sum + d.amount, 0);
  const balance = ingresos - egresos;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await addMovement(values);
      form.resetFields();
      closeModal();
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Resumen */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}><Card><Statistic title="Ingresos" value={ingresos} /></Card></Col>
        <Col span={8}><Card><Statistic title="Egresos" value={egresos} /></Card></Col>
        <Col span={8}><Card><Statistic title="Balance" value={balance} /></Card></Col>
      </Row>

      {/* Botón Nuevo Movimiento */}
      <Button type="primary" icon={<PlusOutlined />} onClick={openModal} style={{ marginBottom: 16 }}>
        Nuevo Movimiento
      </Button>

      {/* Tabla de movimientos */}
      <Table<CashRegister>
        dataSource={data}
        columns={columns}
        rowKey="idCashRegister"
        loading={loading}
      />

      {/* Modal para agregar */}
      <Modal
        title="Registrar Movimiento"
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText="Registrar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="Tipo" initialValue="income" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="income">Ingreso</Select.Option>
              <Select.Option value="expense">Egreso</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="concept" label="Concepto" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="amount" label="Monto" rules={[{ required: true, type: 'number', min: 0 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="method" label="Método" initialValue="cash" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="cash">Efectivo</Select.Option>
              <Select.Option value="qr">QR</Select.Option>
              <Select.Option value="card">Tarjeta</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default HomeCashier;