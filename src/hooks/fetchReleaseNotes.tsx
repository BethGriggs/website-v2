import { useEffect, useState } from 'react';
import { parse } from 'rss-to-json'; 

const baseUrl = 'https://corsproxy.io/?https://bugs.openjdk.org/sr';

export async function fetchReleaseNotesForVersion(
    version: any,
): Promise<apiData> {
    const url = `${baseUrl}/jira.issueviews:searchrequest-rss/temp/SearchRequest.xml?jqlQuery=project+%3D+JDK+AND+fixVersion+%3D+${version}&tempMax=1000`;
    let result = await parse(url).then(rss => {
        return rss
    });
    return result
}