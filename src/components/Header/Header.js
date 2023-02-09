import React from 'react'
import Head from "next/head";

export default function Header(
    { title, description, image }
) {

    return (
        <Head>
            <title>{title}</title>
            <meta id="og-title" property="og:title" content={title} />
            <meta id="og-description" property="og:description" content={description} />
            <meta id="og-image" property="og:image" content={image} />
            <meta id="twitter-title" property="twitter:title" content={title} />
            <meta id="twitter-description" property="twitter:description" content={description} />
            <meta id="twitter-image" property="twitter:image" content={image} />
            <link id='page-image' rel="apple-touch-icon" href={image} />
            <meta name="msapplication-TileColor" content="#F6C30D" />
            <meta name="theme-color" content="#1A1A1A" />
            {image && image.includes('.gif') ? <meta content="image/gif" property="og:image:type" /> : '' }
        </Head>
    )
};
