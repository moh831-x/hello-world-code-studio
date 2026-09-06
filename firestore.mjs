const SDK_VERSION = '12.18.0';
export function validConfig(config) {
  return !!config && ['apiKey','authDomain','projectId','appId'].every(key => typeof config[key] === 'string' && config[key].trim().length > 0);
}
export async function loadFirebaseSDK() {
  const base = `https://www.gstatic.com/firebasejs/${SDK_VERSION}/`;
  const [app, auth, firestore] = await Promise.all([
    import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')
  ]);
  return { ...app, ...auth, ...firestore };
}
// Dependency injection keeps the storage contract testable without a live project.
export function createCloudStore(config, loadSDK = loadFirebaseSDK) {
  let connection;
  async function connect() {
    if (!validConfig(config)) throw new Error('Firebase is not configured. Add your public web app configuration in WordPress settings.');
    if (!connection) connection = (async () => {
      const sdk = await loadSDK();
      const app = sdk.initializeApp(config, 'hello-world-code-studio');
      const auth = sdk.getAuth(app);
      await auth.authStateReady();
      const user = auth.currentUser || (await sdk.signInAnonymously(auth)).user;
      return { sdk, user, db: sdk.getFirestore(app) };
    })().catch(error => { connection = null; throw error; });
    return connection;
  }
  function validateLanguage(language) {
    if (!language || typeof language.name !== 'string' || typeof language.file !== 'string' || !language.name || language.name.length > 64 || language.file.length > 128) throw new Error('Invalid language.');
  }
  async function reference(language) {
    validateLanguage(language);
    const {sdk,user,db} = await connect();
    return {sdk, ref: sdk.doc(db,'helloWorldUsers',user.uid,'drafts',encodeURIComponent(language.name))};
  }
  return {
    async save(language, code) {
      if(typeof code !== 'string' || code.length > 100000) throw new Error('Cloud drafts must be 100,000 characters or fewer. Download larger files instead.');
      const {sdk,ref} = await reference(language);
      // setDoc resolves only after the server acknowledges the write.
      await sdk.setDoc(ref,{language:language.name,filename:language.file,code,updatedAt:sdk.serverTimestamp()});
    },
    async load(language) {
      const {sdk,ref} = await reference(language);
      const snapshot = await sdk.getDocFromServer(ref);
      if(!snapshot.exists()) return null;
      const data=snapshot.data();
      if(data.language !== language.name || data.filename !== language.file || typeof data.code !== 'string' || data.code.length > 100000) throw new Error('The cloud draft is not valid for this language.');
      return data.code;
    }
  };
}
