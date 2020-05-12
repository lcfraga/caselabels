db.createUser({
  user: 'caselabels',
  pwd: 'caselabels',
  roles: [
    {
      role: 'readWrite',
      db: 'caselabels',
    },
  ],
});
