module.exports = {
  extends: 'lighthouse:default',
  settings: {
    skipAudits: ['redirects-http']
  }
};