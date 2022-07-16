import { Input,
	DatePicker,
	Switch,
	Checkbox,
	TimePicker,
	InputNumber
} from 'antd';
import RcImage from '../components/Image';
import RcUpload from '../components/Upload';
import RcCollapseCard from '../components/Collapse';
import RcCollapseAccommondation from '../components/Collapse/CollapseAcommondation';
import RcCollapseWedding from '../components/Collapse/CollapseWedding';
import RcCollapseBlog from '../components/Collapse/CollapseBlog';
import RcCustomer from '../components/Collapse/Collapse2';
import RcSlideVideo from '../components/Collapse/Collapse3';
import RcSelectTopic from '../components/Collapse/CollapseSelectTopic';
import RichTextEditor from '../components/RichTextEditor';
import RcCategory from '../views/Category/List';
import RcTopic from '../views/Topic/List';
import RcVoucher from '../views/Voucher/List';
import RcLink from '../components/Link';
import RcInputAlias from '../components/Input/InputAlias';
import RcCollapseMenu from '../components/Collapse/RcCollapseMenu';

const { RangePicker } = DatePicker;

const widgets = {
	Input, DatePicker, RangePicker,
	RcSelectTopic,
	RcInputAlias,
	RcImage,
	RcVoucher,
	RcTopic,
	RcCollapseBlog,
	RcCategory,
	RcCollapseWedding,
	RcCollapseAccommondation,
	RcUpload, RcCollapseCard,
	RichTextEditor,
	Switch, Checkbox,
	TimePicker,
	RcCustomer,
	RcSlideVideo,
	InputNumber,
	RcLink,
	RcCollapseMenu
};

export default widgets;
