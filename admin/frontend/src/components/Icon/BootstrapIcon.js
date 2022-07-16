import React from 'react';
import classNames from 'classnames';
import { InlineIcon } from '@iconify/react';
import phoneAlt from '@iconify/icons-fa-solid/phone-alt';
import fileIcon from '@iconify/icons-fa-solid/file';
import chartLine from '@iconify/icons-fa-solid/chart-line';
import giftIcon from '@iconify/icons-fa-solid/gift';
import windowRestore from '@iconify/icons-fa-solid/window-restore';
import trophyIcon from '@iconify/icons-fa-solid/trophy';
import videoIcon from '@iconify/icons-fa-solid/video';
import imagesIcon from '@iconify/icons-fa-solid/images';
import umbrellaBeach from '@iconify/icons-fa-solid/umbrella-beach';
import folderIcon from '@iconify/icons-fa-solid/folder';
import homeIcon from '@iconify/icons-fa-solid/home';
import mapPin from '@iconify/icons-fa-solid/map-pin';
import usersIcon from '@iconify/icons-fa-solid/users';
import houseUser from '@iconify/icons-fa-solid/house-user';
import warehouseIcon from '@iconify/icons-fa-solid/warehouse';
import glassCheers from '@iconify/icons-fa-solid/glass-cheers';
import briefcaseIcon from '@iconify/icons-fa-solid/briefcase';
import writingHandDarkSkinTone from '@iconify/icons-twemoji/writing-hand-dark-skin-tone';
import clockIcon from '@iconify/icons-fa-solid/clock';
import notesMedical from '@iconify/icons-fa-solid/notes-medical';
import textWidth from '@iconify/icons-fa-solid/text-width';
import trashAlt from '@iconify/icons-fa-solid/trash-alt';
import globeIcon from '@iconify/icons-fa-solid/globe';
import powerOff from '@iconify/icons-fa-solid/power-off';
import wrenchIcon from '@iconify/icons-fa-solid/wrench';
import appleAlt from '@iconify-icons/fa-solid/apple-alt';
import alignJustify from '@iconify/icons-fa-solid/align-justify';
import buildingIcon from '@iconify/icons-fa-solid/building';
import photoVideo from '@iconify/icons-fa-solid/photo-video';
import utensilsIcon from '@iconify/icons-fa-solid/utensils';
import editIcon from '@iconify/icons-fa-solid/edit';
import spaIcon from '@iconify/icons-fa-solid/spa';
import gopuramIcon from '@iconify/icons-fa-solid/gopuram';
import vrCardboard from '@iconify/icons-fa-solid/vr-cardboard';
import medalIcon from '@iconify/icons-fa-solid/medal';
import restroomIcon from '@iconify/icons-fa-solid/restroom';
import sitemapIcon from '@iconify/icons-fa-solid/sitemap';
import campgroundIcon from '@iconify/icons-fa-solid/campground';
import storeIcon from '@iconify/icons-fa-solid/store';
import styles from './Bootstrap.less';


const SitemapIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={sitemapIcon} className={clsString} style={stls} />
	);
};

const WarehouseIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={warehouseIcon} className={clsString} style={stls} />
	);
};

const StoreIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#d4b415'
	}, style);
	return (
		<InlineIcon icon={storeIcon} className={clsString} style={stls} />
	);
};

const GopuramIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={gopuramIcon} className={clsString} style={stls} />
	);
};

const CampgroundIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={campgroundIcon} className={clsString} style={stls} />
	);
};

const RestroomIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#7cdb69'
	}, style);
	return (
		<InlineIcon icon={restroomIcon} className={clsString} style={stls} />
	);
};
const MedalIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#ceff08'
	}, style);
	return (
		<InlineIcon icon={medalIcon} className={clsString} style={stls} />
	);
};
const VrCardboard = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={vrCardboard} className={clsString} style={stls} />
	);
};
const SpaIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#fa14b1'
	}, style);
	return (
		<InlineIcon icon={spaIcon} className={clsString} style={stls} />
	);
};
const EditIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#459fff'
	}, style);
	return (
		<InlineIcon icon={editIcon} className={clsString} style={stls} />
	);
};
const AppleAlt = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={appleAlt} className={clsString} style={stls} />
	);
};
const PhotoVideo = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={photoVideo} className={clsString} style={stls} />
	);
};
const WrenchIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={wrenchIcon} className={clsString} style={stls} />
	);
};
const PowerOff = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={powerOff} className={clsString} style={stls} />
	);
};
const BuildingIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={buildingIcon} className={clsString} style={stls} />
	);
};
const WritingHandDarkSkinTone = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={writingHandDarkSkinTone} className={clsString} style={stls} />
	);
};
const GlobeIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={globeIcon} className={clsString} style={stls} />
	);
};
const TrashAlt = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		// color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={trashAlt} className={clsString} style={stls} />
	);
};
const TextWidth = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={textWidth} className={clsString} style={stls} />
	);
};
const NotesMedical = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={notesMedical} className={clsString} style={stls} />
	);
};
const ClockIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={clockIcon} className={clsString} style={stls} />
	);
};
const BriefcaseIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#f38629'
	}, style);
	return (
		<InlineIcon icon={briefcaseIcon} className={clsString} style={stls} />
	);
};
const GlassCheers = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={glassCheers} className={clsString} style={stls} />
	);
};
const HouseUser = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={houseUser} className={clsString} style={stls} />
	);
};
const UsersIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={usersIcon} className={clsString} style={stls} />
	);
};
const MapPin = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: 'red'
	}, style);
	return (
		<InlineIcon icon={mapPin} className={clsString} style={stls} />
	);
};
const HomeIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: 'red'
	}, style);
	return (
		<InlineIcon icon={homeIcon} className={clsString} style={stls} />
	);
};
const PhoneAlt = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={phoneAlt} className={clsString} style={stls} />
	);
};
const FileIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={fileIcon} className={clsString} style={stls} />
	);
};
const ChartLine = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={chartLine} className={clsString} style={stls} />
	);
};
const GiftIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: 'red'
	}, style);
	return (
		<InlineIcon icon={giftIcon} className={clsString} style={stls} />
	);
};
const WindowRestore = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={windowRestore} className={clsString} style={stls} />
	);
};
const TrophyIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={trophyIcon} className={clsString} style={stls} />
	);
};
const UtensilsIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
	}, style);
	return (
		<InlineIcon icon={utensilsIcon} className={clsString} style={stls} />
	);
};
const VideoIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={videoIcon} className={clsString} style={stls} />
	);
};
const ImagesIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={imagesIcon} className={clsString} style={stls} />
	);
};
const UmbrellaBeach = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: '#1ec16d'
	}, style);
	return (
		<InlineIcon icon={umbrellaBeach} className={clsString} style={stls} />
	);
};
const FolderIcon = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: 'red'
	}, style);
	return (
		<InlineIcon icon={folderIcon} className={clsString} style={stls} />
	);
};
const AlignJustify = ({ style, className }) => {
	const clsString = classNames(styles.icon, className);
	const stls = Object.assign({
		color: 'red',
	}, style);
	return (
		<InlineIcon icon={alignJustify} className={clsString} style={stls} />
	);
};

const BootstrapIcon = {
	WrenchIcon,
	PowerOff,
	GlobeIcon,
	TrashAlt,
	TextWidth,
	NotesMedical,
	ClockIcon,
	BriefcaseIcon,
	GlassCheers,
	HouseUser,
	UsersIcon,
	MapPin,
	HomeIcon,
	WritingHandDarkSkinTone,
	PhoneAlt,
	StoreIcon,
	FileIcon,
	RestroomIcon,
	UtensilsIcon,
	BuildingIcon,
	ChartLine,
	GiftIcon,
	WindowRestore,
	TrophyIcon,
	VideoIcon,
	ImagesIcon,
	UmbrellaBeach,
	FolderIcon,
	AppleAlt,
	AlignJustify,
	PhotoVideo,
	EditIcon,
	SpaIcon,
	MedalIcon,
	GopuramIcon,
	CampgroundIcon,
	VrCardboard,
	WarehouseIcon,
	SitemapIcon
};

export default BootstrapIcon;
