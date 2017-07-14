import React from 'react';

const EditIcon = (props = {}) => (
  <svg fill="#000000" height={props.size || 24} viewBox="0 0 24 24" width={props.size || 24} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export { EditIcon };

const DeleteIcon = (props = {}) => (
  <svg fill="#000000" height={props.size || 24} viewBox="0 0 24 24" width={props.size || 24} xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export { DeleteIcon };

const CloseIcon = (props = {}) => (
  <svg fill="#000000" height={props.size || 24} viewBox="0 0 24 24" width={props.size || 24} xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
  </svg>
);

export { CloseIcon };
