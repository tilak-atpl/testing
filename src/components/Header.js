import React from 'react';
import classNames from 'classnames';
import { Layout } from "antd";
import { useSelector } from 'react-redux';
import { matchColor } from '../utils/constants';
const { Header } = Layout;

export default function HeaderBar({title, classes, style}) {
    const { themeColor } = useSelector( ({User}) => User);

    return(
        <Header className={classNames("flex justify-center items-center text-white text-[24px]", classes)} style={{paddingInline: 0, background: matchColor(themeColor), ...style}}>
            {title}
        </Header>
    )
}