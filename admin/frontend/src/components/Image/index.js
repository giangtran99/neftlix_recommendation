import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Modal } from 'antd';
import FileManager from '../FileManager';
import _ from 'lodash';
import { Icon, InlineIcon } from '@iconify/react';
import plusIcon from '@iconify/icons-fa-solid/plus';
import trashAlt from '@iconify/icons-fa-solid/trash-alt';
import eyeIcon from '@iconify/icons-fa-solid/eye';
import Config from '../../utils/config';

import styles from './Image.less';
const IMG_URL = Config.IMAGE_URI;

const Image = (props) => {
	const fileManagerRef = useRef(null);
	const { value, onChange, mode = "multiple" } = props;
	const [previewVisible, setPreviewVisible] = useState(false);
	const [fmVisible, setFmVisible] = useState(false);
	const [images, setImages] = useState([]);
	const [previewImage, setPreviewImage] = useState();

	useEffect(() => {
		setImages(Array.isArray(value) ? value : value ? [value] : []);
	}, [value]);

	const showFileManager = (e) => {
		setFmVisible(true);
	};

	const hideFileManager = (e) => {
		setFmVisible(false);
	};

	const handleChange = (val) => {
		let arrImg = _.cloneDeep(images);
		if (mode === "multiple") {
			const newImgs = val.filter(i => {
				const find = arrImg.find(j => j.name === i.name);
				if (find) {
					return false;
				}
				return true;
			});

			arrImg = _.concat(arrImg, newImgs);
		} else {
			arrImg = _.concat([], ((val || [])[val.length - 1] || []));
		}
		console.log('2.handleChange %o -> arrImg %o', props.name, arrImg);
		setImages(arrImg);
		if (onChange) {
			onChange(arrImg);
		}
	};
	// const memoChange = useMemo((val) => handleChange(val), [fmVisible]);

	const handleOk = () => {
		setFmVisible(false);
		if (fileManagerRef && fileManagerRef.current) {
			fileManagerRef.current.resetSelect();
		}
	};

	const removeImage = (e, file, idx) => {
		e.preventDefault();
		var arrImg = _.clone(images);
		arrImg.splice(idx, 1);
		setImages(arrImg);
		if (onChange) {
			onChange(arrImg);
		}
	};

	const onPreview = async (e, file) => {
		// e.stopPropagation();
		e.preventDefault();
		setPreviewImage(`${IMG_URL}${file.path}` || file.url);
		setPreviewVisible(true);
	};

	return (
		<>
			<div className={styles.pics}>
				{images.map((i, idx) => (<div key={`${i.name}-${idx}` || idx} className={styles.picCardInfo}>
					<div className={styles.picInfo}>
						<span>
							<a href={`${IMG_URL}${i.path}`} className={styles.picThumbnail} target="_blank">
								<img src={`${IMG_URL}${i.path}`} alt={i.name || ''} />
							</a>
						</span>
					</div>
					<span className={styles.picAction}>
						<a href={`${IMG_URL}${i.path}`} onClick={(e) => onPreview(e, i)} target="_blank">
							<Icon className={styles.iconEye} icon={eyeIcon} />
						</a>
						<button type='button' className={styles.btnDelete} onClick={e => removeImage(e, i, idx)}>
							<Icon className={styles.iconDelete} icon={trashAlt} />
						</button>
					</span>
				</div>))}
				<div className={styles.picCard} onClick={showFileManager}>
					<span className={styles.picIcon}><Icon className={styles.icon} icon={plusIcon} width="48" height="48" /></span>
				</div>
			</div>
			<Modal
				style={{ top: "50px" }}
				width={window.innerWidth - 200}
				title="Quản lý file"
				visible={fmVisible}
				onOk={handleOk}
				onCancel={hideFileManager}
				destroyOnClose
			>
				<FileManager key={props.name} ref={fileManagerRef} handleChange={handleChange} />
			</Modal>
			<Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
				<img alt="example" style={{ width: '100%' }} src={previewImage} />
			</Modal>
		</>
	);
};

export default React.memo(Image);
