module.exports = {
  default: process.env.FILESYSTEM_DRIVER || 'local',
  disks: {
    local: {
      driver: 'local',
      root: 'static',
    },
    s3: {
      driver: 's3',
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION,
      bucket: process.env.AWS_BUCKET,
      endpoint: process.env.AWS_ENDPOINT,
      visibility: process.env.AWS_VISIBILITY,
    },
    space: {
      driver: 's3',
      key: process.env.SPACE_KEY,
      secret: process.env.SPACE_SECRET,
      endpoint: process.env.SPACE_ENDPOINT,
      region: process.env.SPACE_REGION,
      bucket: process.env.SPACE_BUCKET,
      root: process.env.SPACE_ROOT,
      visibility: process.env.SPACE_VISIBILITY,
    },
  },
};
