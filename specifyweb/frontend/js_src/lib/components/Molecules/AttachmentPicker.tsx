import React from 'react';

/**
 * Attachment Picker loads ResourceView, which in turn loads a ton of
 * things. Replace with async import to split the bundle
 */
export const AttachmentPicker = React.lazy(async () =>
  import('./SyncAttachmentPicker').then(({ SyncAttachmentPicker }) => ({
    default: SyncAttachmentPicker,
  }))
);
