import React from 'react';
import {
	QuestionOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	RestOutlined
} from '@ant-design/icons';
import { Icon, InlineIcon } from '@iconify/react';
import shippingFast from '@iconify-icons/fa-solid/shipping-fast';

export const statusEnum = {
	"-1": { text: 'Tất cả', status: 'Default' },
	"1": { text: 'Hoạt động', status: 'Processing' },
	"0": { text: 'Dừng', status: 'Default' },
	"2": { text: 'Ẩn', status: 'Error' },
};

export const pharmacyEnum = {
	"online": { text: 'Online', status: 'Default' },
	"offline": { text: 'Offline', status: 'Processing' },
};

export const statusBuyVoucher = {
	1: true,
	2: false,
};

export const status1Enum = {
	all: { text: 'Tất cả', status: 'Default' },
	off: { text: 'Dừng', status: 'Default' },
	active: { text: 'Hoạt động', status: 'Processing' },
	hidden: { text: 'Ẩn', status: 'Error' },
};

export const partnersEnum = {
	all: { text: 'Tất cả', status: 'Default' },
	baned: { text: 'Dừng', status: 'Default' },
	active: { text: 'Hoạt động', status: 'Processing' },
	hidden: { text: 'Ẩn', status: 'Error' },
};

export const statusArticleEnum = {
	"-1": { text: 'All', status: 'Default' },
	"1": { text: 'Publish', status: 'Default' },
	"0": { text: 'Unpublish', status: 'Processing' },
	"2": { text: 'Delete', status: 'Error' },
};

export const genderEnum = {
	"1": { text: 'Nam' },
	"0": { text: 'Nữ' },
};

export const regionEnum = {
	"mien-bac": { text: 'Miền Bắc', id: 256 },
	"mien-nam": { text: 'Miền Nam', id: 255 },
	"mien-trung": { text: " Miên Trung", id: 257 }
};

export const typeEnum = {
	"location": { text: "Khu vực" },
	"store": { text: "Cửa hàng" }

};
export const statusOrder = {
	"pending": { text: "Chờ xác nhận", color: "#87d068", icon: <QuestionOutlined /> },
	"shipping": { text: "Đang vận chuyển", color: "#d1c02b", icon: <Icon icon={shippingFast} /> },
	"completed": { text: "Đã giao", color: "#2db7f5", icon: <CheckCircleOutlined /> },
	"cancelled": { text: "Đã hủy", color: "#f50", icon: <CloseCircleOutlined /> },
	"admin_approved":{text:"Admin đã duyệt",color: "#DA70D6",icon:<CheckCircleOutlined />},
	"undeliverable":{text:"Không vận chuyển được",color: "#ffaa80",icon:<RestOutlined />},
	"partner_approved":{text:"Đối tác đã duyệt",color: "#ffb3ff",icon:<CheckCircleOutlined />},
	"out_of_stock":{text:"Hết hàng",color: "#ffb3ff",icon:<RestOutlined />}
};
export const statusOrderMpoint = {
	"pending": { text: "Chờ xác nhận" },
	"shipping": { text: "Đang vận chuyển" },
	"completed": { text: "Đã giao" },
	"canceled": { text: "Đã hủy" },
};
export const paymentMethod = {
	"cod": { text: "COD" },
	"online": { text: "Online" }
};

export const statusGameEnum = {
	"-1": { text: 'Lỗi cộng lượt quay', status: 'Default' },
	"1": { text: 'Đã cộng lượt quay', status: 'Processing' },
	"-2": { text: 'Chưa có tài khoản Mpoint', status: 'Default' },
	"-3": { text: 'Chưa cộng lượt quay', status: 'Error' },
};

export const statusMiniGameEnum = {
	"-1": { text: 'Tất cả', status: 'Default' },
	"1": { text: 'Hoạt động', status: 'Processing' },
	"0": { text: 'Dừng', status: 'Error' },
	// "2": { text: 'Ẩn', status: 'Error' },
};

export const productEnum = {
	14: { text: "eyemiru 40ex", enId: 43, vnId: 14 },
	15: { text: "eyemiru wash", enId: 44, vnId: 15 }
};

// 'hidden', 'active', 'out_of_stock'
export const productShopEnum = {
	"hidden": { text: "Ẩn", status: 'Error' },
	"active": { text: "Hoạt động", status: 'Processing' },
	"out_of_stock": { text: "Hết hàng", status: 'Default' }
};


export const listPosition = {
	"left": { text: "Bên trái" },
	"right": { text: "Bên phải" }
};


