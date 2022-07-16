import React, { Suspense, useState } from 'react';
import { Typography, Card, Form, Timeline, Row, Col, Divider, Table, Select } from 'antd';
import { injectIntl } from 'react-intl';
import styles from './style.less';
import { toDot } from '../../utils/utils';
import { HomeFilled, ProfileFilled, FundFilled, CreditCardFilled, ShoppingFilled, DollarCircleFilled, BankFilled, SignalFilled, WalletFilled, CalculatorFilled } from '@ant-design/icons';
import {
    Bar,
    XAxis,
    YAxis,
    BarChart,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

const { Option } = Select;
const { Title } = Typography;
const Home = props => {

    return (
        <>
        

        </>
    );
};

export default injectIntl(Home);
