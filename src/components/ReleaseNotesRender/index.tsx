import React, { useState, useEffect } from 'react';
import { fetchReleaseNotesForVersion } from '../../hooks';
import { useQueryParam, StringParam } from 'use-query-params'

const ReleaseNotesRender = (): null | JSX.Element => {
  let selectedVersion
  let [versionParam] = useQueryParam('version', StringParam)
  if (versionParam) {
      selectedVersion = versionParam;
  }

  const [version, udateVersion] = useState(selectedVersion);
  const [releaseNotes, setReleaseNotes] = useState(null);

  useEffect(() => {
    (async () => {
      if (selectedVersion) {
        setReleaseNotes(await fetchReleaseNotesForVersion(version));
      }
    })();
  }, [version]);

  console.log(releaseNotes)

  return (
    <div className="p-5 text-center">
	    <div className="container">
      {version ? (
        <h2>Release Notes for {version}</h2>
      ) : (
        <>
        <h2>Oops... We couldn't find those release notes</h2>
        <span>Please ensure that you have a specified a version using the version URL parameter: <code>?version=x.x.x</code></span>
        </>
      )}
      {releaseNotes && (
          releaseNotes.items.map(
            (issue, i): string | JSX.Element =>
              issue && (
                <>
                <span><a href={issue.link}>{issue.title}</a></span>
                <br/>
                </>
              )
            )
        )}
      </div>
    </div>
  );
};

export default ReleaseNotesRender;
