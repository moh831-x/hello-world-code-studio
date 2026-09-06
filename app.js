const appAssetBase = new URL('.', document.currentScript.src);
const languages = [
  ['Python','py','Scripting','Popular','1991','#3977a6','#eaf1f7','print("Hello, World!")','hello.py'],
  ['JavaScript','JS','Web','Popular','1995','#9f8528','#faf3cd','console.log("Hello, World!");','hello.js'],
  ['Java','Jv','General purpose','Popular','1995','#c58259','#fbefe8','class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}','HelloWorld.java'],
  ['C','C','Systems','Popular','1972','#667ca4','#edf0f8','#include <stdio.h>\n\nint main(void) {\n  printf("Hello, World!\\n");\n  return 0;\n}','hello.c'],
  ['C++','C++','Systems','Popular','1985','#6586b4','#eaf0f9','#include <iostream>\n\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n}','hello.cpp'],
  ['Go','Go','Systems','Popular','2009','#4b9daa','#e7f5f7','package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello, World!")\n}','hello.go'],
  ['Rust','Rs','Systems','Popular','2015','#a97659','#f4ece7','fn main() {\n    println!("Hello, World!");\n}','hello.rs'],
  ['TypeScript','TS','Web','Popular','2012','#427daf','#eaf2fa','const message: string = "Hello, World!";\nconsole.log(message);','hello.ts'],
  ['Ruby','Rb','Scripting','','1995','#bc6571','#f9eaee','puts "Hello, World!"','hello.rb'],
  ['Swift','Sw','General purpose','Popular','2014','#d18863','#fff0e7','print("Hello, World!")','hello.swift'],
  ['Kotlin','Kt','General purpose','Popular','2011','#9268c3','#f1eafa','fun main() {\n    println("Hello, World!")\n}','hello.kt'],
  ['C#','C#','General purpose','Popular','2000','#9370b9','#f0eaf7','using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, World!");\n  }\n}','Hello.cs'],
  ['PHP','php','Web','','1995','#7b75ac','#efedf8','<?php\necho "Hello, World!\\n";','hello.php'],
  ['Bash','$_','Scripting','','1989','#739976','#edf5ec','#!/usr/bin/env bash\nprintf "Hello, World!\\n"','hello.sh'],
  ['R','R','Scripting','','1993','#6790ba','#eaf1f9','cat("Hello, World!\\n")','hello.R'],
  ['Dart','Da','General purpose','','2011','#509fba','#e7f4f9','void main() {\n  print("Hello, World!");\n}','hello.dart'],
  ['Lua','Lu','Scripting','','1993','#6867ad','#eeedf9','print("Hello, World!")','hello.lua'],
  ['Perl','Pl','Scripting','','1987','#6e91a8','#ebf2f7','print "Hello, World!\\n";','hello.pl'],
  ['Haskell','Hs','Functional','','1990','#9d79b1','#f3ecf7','main :: IO ()\nmain = putStrLn "Hello, World!"','hello.hs'],
  ['Elixir','Ex','Functional','','2011','#9575ab','#f2ecf7','IO.puts("Hello, World!")','hello.exs'],
  ['Scala','Sc','Functional','','2004','#bf7378','#f9ecee','object HelloWorld {\n  def main(args: Array[String]): Unit = {\n    println("Hello, World!")\n  }\n}','HelloWorld.scala'],
  ['Clojure','Cl','Functional','','2007','#769b74','#edf5eb','(println "Hello, World!")','hello.clj'],
  ['F#','F#','Functional','','2005','#699cad','#ebf5f7','printfn "Hello, World!"','hello.fsx'],
  ['Erlang','Er','Functional','','1986','#ba708b','#f9eaf0','-module(hello).\n-export([main/0]).\n\nmain() ->\n    io:format("Hello, World!~n").','hello.erl'],
  ['OCaml','Oc','Functional','','1996','#bd9459','#f9f1e6','print_endline "Hello, World!"','hello.ml'],
  ['Julia','Jl','Scripting','','2012','#9475ad','#f1ebf7','println("Hello, World!")','hello.jl'],
  ['PowerShell','PS','Scripting','','2006','#6895bf','#ebf2fa','Write-Output "Hello, World!"','hello.ps1'],
  ['Zig','Zg','Systems','','2016','#bf9a59','#faf3e5','const std = @import("std");\n\npub fn main() void {\n    std.debug.print("Hello, World!\\n", .{});\n}','hello.zig'],
  ['Nim','Nm','Systems','','2008','#b19b53','#f8f4e4','echo "Hello, World!"','hello.nim'],
  ['D','D','Systems','','2001','#b37373','#f8eeee','import std.stdio;\n\nvoid main() {\n    writeln("Hello, World!");\n}','hello.d'],
  ['Fortran','Ft','General purpose','','1957','#9d78a7','#f5edf7','program hello\n  print *, "Hello, World!"\nend program hello','hello.f90'],
  ['Pascal','Pa','General purpose','','1970','#738faa','#edf2f8',"program Hello;\nbegin\n  WriteLn('Hello, World!');\nend.",'hello.pas'],
  ['COBOL','Co','General purpose','','1959','#8f93a4','#f0f1f5','       IDENTIFICATION DIVISION.\n       PROGRAM-ID. HELLO.\n       PROCEDURE DIVISION.\n           DISPLAY "Hello, World!".\n           STOP RUN.','hello.cob'],
  ['Racket','Rk','Functional','','1995','#aa7582','#f8edf0','#lang racket\n(displayln "Hello, World!")','hello.rkt'],
  ['Common Lisp','CL','Functional','','1984','#8f7dab','#f0edf7','(format t "Hello, World!~%")','hello.lisp'],
  ['Scheme','Scm','Functional','','1975','#9a7eae','#f2edf7','(display "Hello, World!")\n(newline)','hello.scm'],
  ['Groovy','Gr','Scripting','','2003','#71a0b1','#edf5f8',"println 'Hello, World!'",'hello.groovy'],
  ['Tcl','Tcl','Scripting','','1988','#b18071','#f9efeb','puts "Hello, World!"','hello.tcl'],
  ['AWK','awk','Scripting','','1977','#889871','#f0f4ea','BEGIN { print "Hello, World!" }','hello.awk'],
  ['Objective-C','Oc','Systems','','1984','#758aaa','#edf1f8','#import <Foundation/Foundation.h>\n\nint main(void) {\n  @autoreleasepool {\n    NSLog(@"Hello, World!");\n  }\n  return 0;\n}','hello.m']
].map(([name,icon,category,popular,year,color,tint,code,file])=>({name,icon,category,popular,year,color,tint,code,file}));

const grid = document.querySelector('#grid');
const search = document.querySelector('#search');
const sort = document.querySelector('#sort');
let filter = 'All';
let toastTimer;
const escapeHtml = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
function highlight(line) {
  return line.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g).map((part,i)=>i%2?`<span class="str">${escapeHtml(part)}</span>`:escapeHtml(part)).join('');
}
const aliases = {
  'JavaScript': ['js', 'ecmascript'], 'TypeScript': ['ts'], 'Python': ['py', 'python3'],
  'C++': ['cpp', 'cplusplus', 'c plus plus'], 'C#': ['csharp', 'c sharp', 'cs'],
  'F#': ['fsharp', 'f sharp'], 'Go': ['golang'], 'Rust': ['rs'],
  'Bash': ['shell', 'sh'], 'Objective-C': ['objc', 'objective c'],
  'Common Lisp': ['lisp'], 'PowerShell': ['pwsh', 'ps1']
};
function searchScore(language, query) {
  if (!query) return 1;
  const name = language.name.toLowerCase();
  const nicknames = aliases[language.name] || [];
  const extension = language.file.slice(language.file.lastIndexOf('.')).toLowerCase();
  if (name === query) return 100;
  if (nicknames.includes(query) || extension === query) return 90;
  if (name.startsWith(query)) return 75;
  if (name.includes(query)) return 60;
  const metadata = [name, ...nicknames, language.category, language.popular, language.file].join(' ').toLowerCase();
  const searchable = metadata + ' ' + language.code.toLowerCase();
  if (!query.split(/\s+/).every(term => searchable.includes(term))) return 0;
  return metadata.includes(query) ? 40 : 20;
}
function render() {
  const query = search.value.trim().toLowerCase();
  let shown = languages.filter(l => (filter === 'All' || l.category === filter || l.popular === filter) && searchScore(l, query) > 0);
  if (sort.value === 'az') shown.sort((a,b) => a.name.localeCompare(b.name));
  else if (query) shown.sort((a,b) => searchScore(b,query) - searchScore(a,query));
  const url = new URL(location.href);
  if (search.value.trim()) url.searchParams.set('q',search.value.trim()); else url.searchParams.delete('q');
  if (filter !== 'All') url.searchParams.set('category',filter); else url.searchParams.delete('category');
  if (sort.value === 'az') url.searchParams.set('sort','az'); else url.searchParams.delete('sort');
  history.replaceState(null, '', url);
  grid.innerHTML = shown.map(l=>`<article class="card"><div class="card-header"><span class="language-icon" style="--color:${l.color};--tint:${l.tint}">${escapeHtml(l.icon)}</span><div class="language-name"><h3>${escapeHtml(l.name)}</h3><small>${l.category}</small></div><span class="badge">${l.year}</span></div><div class="code-block"><button class="copy" data-language="${escapeHtml(l.name)}" aria-label="Copy ${escapeHtml(l.name)} code" title="Copy code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg></button><pre><code>${l.code.split('\n').map((line,i)=>`<span class="ln" aria-hidden="true">${i+1}</span>${highlight(line)}`).join('\n')}</code></pre></div><div class="card-footer"><span>${l.file}</span><button class="open-editor" data-language="${escapeHtml(l.name)}">Edit code ↗</button></div></article>`).join('');
  document.querySelector('#results-count').textContent=`${shown.length} ${shown.length===1?'language':'languages'}${query ? ` found for “${search.value.trim()}”` : ' in the index'}${filter !== 'All' ? ` · ${filter}` : ''}`;
  document.querySelector('#empty').hidden=shown.length!==0;
}
function toast(message) {
  const el=document.querySelector('#toast');
  el.textContent=message; el.classList.add('visible');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('visible'),2400);
}
document.querySelector('.filters').addEventListener('click',e=>{
  const button=e.target.closest('button'); if(!button)return;
  filter=button.dataset.filter;
  document.querySelectorAll('.filters button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  render();
});
grid.addEventListener('click',async e=>{
  const button=e.target.closest('.copy'); if(!button)return;
  const language=languages.find(l=>l.name===button.dataset.language);
  try {
    if(navigator.clipboard&&window.isSecureContext) await navigator.clipboard.writeText(language.code);
    else {
      const area=document.createElement('textarea'); area.value=language.code;
      area.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(area);area.select();
      const copied=document.execCommand('copy');area.remove();button.focus();if(!copied)throw new Error('Copy unavailable');
    }
    toast(`${language.name} example copied!`);
  } catch {toast('Copy unavailable. Select the code to copy it manually.');}
});
search.addEventListener('input',render);sort.addEventListener('change',render);
document.querySelector('#reset').addEventListener('click',()=>{search.value='';sort.value='featured';document.querySelector('[data-filter="All"]').click();search.focus();});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();search.focus();}if(e.key==='Escape'&&document.activeElement===search){search.value='';render();search.blur();}});
document.querySelector('#search-form').addEventListener('submit', e => {
  e.preventDefault(); render(); document.querySelector('#languages').scrollIntoView({behavior: 'smooth'});
});
document.querySelector('.suggestions').addEventListener('click', e => {
  const button = e.target.closest('button'); if (!button) return;
  search.value = button.dataset.query;
  document.querySelector('[data-filter="All"]').click();
  document.querySelector('#languages').scrollIntoView({behavior: 'smooth'});
});
function restoreSearch() {
  const params = new URLSearchParams(location.search);
  search.value = params.get('q') || '';
  const category = params.get('category');
  filter = ['All','Popular','Web','Systems','Scripting','Functional'].includes(category) ? category : 'All';
  sort.value = params.get('sort') === 'az' ? 'az' : 'featured';
  document.querySelectorAll('.filters button').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === filter);
    b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
  });
  render();
}
window.addEventListener('popstate', restoreSearch);
restoreSearch();

const editor = document.querySelector('#code-editor');
const editorLanguage = document.querySelector('#editor-language');
const editorLines = document.querySelector('#editor-lines');
const drafts = new Map();
let activeLanguage;
let savedLocally = true;
const draftKey = language => `helloworld:draft:v1:${language.name}`;
editorLanguage.innerHTML = [...languages].sort((a,b)=>a.name.localeCompare(b.name)).map(l=>`<option value="${escapeHtml(l.name)}">${escapeHtml(l.name)}</option>`).join('');
function updateEditorPosition() {
  const before = editor.value.slice(0,editor.selectionStart).split('\n');
  document.querySelector('#editor-position').textContent = `Ln ${before.length}, Col ${before.at(-1).length + 1}`;
}
function refreshEditor() {
  const count = editor.value.split('\n').length;
  editorLines.textContent = Array.from({length:count},(_,i)=>i+1).join('\n');
  editorLines.scrollTop = editor.scrollTop;
  document.querySelector('#editor-size').textContent = `${count} ${count===1?'line':'lines'} · ${editor.value.length} characters`;
  updateEditorPosition();
}
function saveDraft() {
  drafts.set(activeLanguage.name,editor.value);
  try { localStorage.setItem(draftKey(activeLanguage),editor.value); savedLocally = true; }
  catch { savedLocally = false; }
  document.querySelector('#editor-saved').textContent = savedLocally ? 'Saved on this browser' : 'Session only — download to keep';
  refreshEditor();
}
function openEditor(name, focus = true) {
  const language = languages.find(l=>l.name===name);
  if (!language) return;
  if(activeLanguage) saveDraft();
  stopRun(false);
  activeLanguage = language;
  updateRunner();
  editorLanguage.value = name;
  let draft = drafts.get(name);
  savedLocally = true;
  if(draft === undefined) {
    try { draft = localStorage.getItem(draftKey(language)); }
    catch { savedLocally = false; }
  }
  editor.value = draft ?? language.code;
  document.querySelector('#editor-filename').textContent = language.file;
  document.querySelector('#editor-saved').textContent = savedLocally ? (draft == null ? 'Example · ready to edit' : 'Saved on this browser') : 'Session only — download to keep';
  editor.scrollTop = 0; editor.scrollLeft = 0;
  editor.setSelectionRange(0,0); refreshEditor();
  if(focus) { document.querySelector('#editor').scrollIntoView({behavior:'smooth'}); editor.focus({preventScroll:true}); }
}
editor.addEventListener('input',saveDraft);
editor.addEventListener('scroll',()=>{editorLines.scrollTop=editor.scrollTop;});
['keyup','click','select'].forEach(event=>editor.addEventListener(event,updateEditorPosition));
editor.addEventListener('keydown',e=>{
  // Preserve Tab navigation; Ctrl/Cmd+] inserts two spaces.
  if(e.key===']' && (e.ctrlKey||e.metaKey)) {
    e.preventDefault(); editor.setRangeText('  ',editor.selectionStart,editor.selectionEnd,'end'); saveDraft();
  }
  if((e.ctrlKey||e.metaKey)&&e.key==='Enter') { e.preventDefault(); runCode(); }
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s') {e.preventDefault();downloadCode();}
});
editorLanguage.addEventListener('change',()=>openEditor(editorLanguage.value,false));
grid.addEventListener('click',e=>{const button=e.target.closest('.open-editor');if(button)openEditor(button.dataset.language);});
document.querySelector('#editor-example').addEventListener('click',()=>{
  if(editor.value!==activeLanguage.code && !window.confirm(`Replace your ${activeLanguage.name} draft with the original example? Download it first if you want to keep it.`)) return;
  editor.value=activeLanguage.code;saveDraft();editor.focus();
});
document.querySelector('#editor-copy').addEventListener('click',async()=>{
  try {
    if(navigator.clipboard&&window.isSecureContext) await navigator.clipboard.writeText(editor.value);
    else {
      const start=editor.selectionStart,end=editor.selectionEnd;
      editor.focus();editor.select();const copied=document.execCommand('copy');editor.setSelectionRange(start,end);
      if(!copied)throw new Error('Copy unavailable');
    }
    toast('Your code is copied!');
  } catch {toast('Select the code and copy it manually.');}
});
function downloadCode() {
  const url=URL.createObjectURL(new Blob([editor.value],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=activeLanguage.file;
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast(`Downloaded ${activeLanguage.file}`);
}
document.querySelector('#editor-download').addEventListener('click',downloadCode);


const runButton = document.querySelector('#editor-run');
const stopButton = document.querySelector('#editor-stop');
const runOutput = document.querySelector('#run-output');
const runStatus = document.querySelector('#run-status');
let runningWorker = null;
let runTimeout;
let outputCount = 0;
function updateRunner() {
  const supported = activeLanguage.name === 'JavaScript';
  runButton.disabled = !supported || !!runningWorker;
  stopButton.disabled = !runningWorker;
  runStatus.textContent = supported ? 'Ready' : 'Download to run';
  runOutput.textContent = supported ? 'Run JavaScript to see output here.' : `${activeLanguage.name} execution is not available in this browser editor. Download your code and run it with a compatible compiler or runtime.`;
  document.querySelector('#run-help').hidden = !supported;
}
function stopRun(announce = true) {
  if (!runningWorker) return;
  runningWorker.terminate(); runningWorker = null;
  clearTimeout(runTimeout);
  runButton.disabled = activeLanguage.name !== 'JavaScript';
  stopButton.disabled = true;
  if (announce) {runStatus.textContent = 'Stopped'; if (!runOutput.textContent) runOutput.textContent = 'Execution stopped.';}
}
function appendOutput(text) {
  if (outputCount++ >= 200) return;
  runOutput.textContent += String(text).slice(0,10000) + '\n';
  if(outputCount===200) runOutput.textContent += '[Output limit reached]\n';
  runOutput.scrollTop = runOutput.scrollHeight;
}
function runCode() {
  if (activeLanguage.name !== 'JavaScript' || runningWorker) return;
  saveDraft(); outputCount=0; runOutput.textContent='';
  runStatus.textContent='Running…';runButton.disabled=true;stopButton.disabled=false;
  const started = performance.now();
  try {
    const worker = new CodeStudioRunner(new URL('run-worker.js',appAssetBase));
    runningWorker = worker;
    worker.onmessage = ({data}) => {
      if (runningWorker !== worker) return;
      if (data.type === 'log') appendOutput(data.text);
      if (data.type === 'error') {appendOutput(data.text);stopRun(false);runStatus.textContent='Error';}
      if (data.type === 'done') {
        stopRun(false);runStatus.textContent=`Finished · ${Math.round(performance.now()-started)} ms`;
        if (!runOutput.textContent) runOutput.textContent='Finished with no output. Use console.log() to print a value.';
      }
    };
    worker.onerror = e => {
      e.preventDefault();appendOutput(e.message || 'Unable to start the JavaScript worker.');
      stopRun(false);runStatus.textContent='Error';
    };
    runTimeout=setTimeout(()=>{stopRun(false);appendOutput('Execution stopped: exceeded the 5-second time limit.');runStatus.textContent='Timed out';},5000);
    worker.postMessage({code:editor.value});
  } catch (error) {
    stopRun(false);runButton.disabled=false;stopButton.disabled=true;
    appendOutput(error.message);runStatus.textContent='Error';
  }
}
runButton.addEventListener('click',runCode);
stopButton.addEventListener('click',()=>stopRun());
document.querySelector('#output-clear').addEventListener('click',()=>{runOutput.textContent='';});
openEditor('JavaScript',false);

const cloudSave = document.querySelector('#cloud-save');
const cloudLoad = document.querySelector('#cloud-load');
const cloudStatus = document.querySelector('#cloud-status');
const firebaseConfig = window.HELLO_WORLD_FIREBASE;
const cloudConfigured = firebaseConfig && ['apiKey','authDomain','projectId','appId'].every(key=>typeof firebaseConfig[key]==='string'&&firebaseConfig[key].trim());
let cloudStore;
let cloudBusy = false;
if(cloudConfigured) {
  cloudSave.disabled = false; cloudLoad.disabled = false;
  cloudStatus.textContent = 'Cloud ready · private to this browser identity. Save uploads your code to Firebase.';
}
async function getCloudStore() {
  if(!cloudStore) {
    const {createCloudStore} = await import(new URL('firestore.mjs',appAssetBase).href);
    cloudStore = createCloudStore(firebaseConfig);
  }
  return cloudStore;
}
function cloudError(error) {
  const code = error.code || '';
  if(code.includes('permission-denied')) return 'Cloud access denied. Check Firestore rules and your Firebase project.';
  if(code.includes('operation-not-allowed') || code.includes('admin-restricted')) return 'Enable Anonymous sign-in in Firebase Authentication.';
  if(code.includes('unavailable') || code.includes('network')) return 'Cloud unavailable. Your local draft is unchanged; try again when online.';
  return `Cloud operation failed: ${error.message || 'Check your Firebase configuration and connection.'}`;
}
async function cloudAction(mode) {
  if(!cloudConfigured || cloudBusy) return;
  const language=activeLanguage;
  const originalCode=editor.value;
  saveDraft();
  cloudBusy=true;cloudSave.disabled=true;cloudLoad.disabled=true;
  cloudStatus.textContent=`${mode==='save'?'Saving':'Loading'} ${language.name} cloud draft…`;
  try {
    const store=await getCloudStore();
    if(mode==='save') {
      await store.save(language,originalCode);
      cloudStatus.textContent=`${language.name} saved to Firestore.${activeLanguage.name===language.name&&editor.value!==originalCode?' Newer edits are local; save again to upload them.':''}`;
    } else {
      const code=await store.load(language);
      if(code===null) {cloudStatus.textContent=`No cloud draft saved for ${language.name}.`;return;}
      // Never replace code if the user edited or switched languages while waiting.
      if(activeLanguage.name!==language.name || editor.value!==originalCode) {cloudStatus.textContent='Editor changed while loading. Click Load cloud draft again when ready.';return;}
      if(code!==editor.value && !window.confirm(`Replace the current ${language.name} editor contents with your cloud draft? Download your current code first if you want to keep it.`)) {cloudStatus.textContent='Load canceled. Current draft kept.';return;}
      editor.value=code;saveDraft();
      cloudStatus.textContent=`${language.name} cloud draft loaded and saved locally.`;
    }
  } catch(error) {cloudStatus.textContent=cloudError(error);}
  finally {cloudBusy=false;cloudSave.disabled=false;cloudLoad.disabled=false;}
}
cloudSave.addEventListener('click',()=>cloudAction('save'));
cloudLoad.addEventListener('click',()=>cloudAction('load'));
