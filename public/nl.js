/* jederzeitsparen – Newsletter-Anmeldung über Brevo, im Design der Seite.
   Schickt wie Brevos eigenes Formular per POST an "<action>?isAjax=1".
   Klappt das nicht (Netzwerk, Blocker), wird das Formular normal in einem neuen Tab abgeschickt. */
(function(){
  var forms=document.querySelectorAll('form.nl-form');
  if(!forms.length||!window.fetch||!window.FormData)return;
  var MAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  [].forEach.call(forms,function(form){
    var input=form.querySelector('input[name="EMAIL"]');
    var btn=form.querySelector('.nl-knopf');
    var status=form.querySelector('.nl-status');
    var label=btn.textContent;
    form.noValidate=true; /* eigene Fehlermeldung statt Browser-Blase */

    function zeige(text,art){status.textContent=text;status.className='nl-status'+(art?' '+art:'');}
    input.addEventListener('input',function(){if(status.classList.contains('fehler'))zeige('');form.classList.remove('ungueltig');});

    form.addEventListener('submit',function(e){
      e.preventDefault();
      var mail=(input.value||'').trim();
      if(!MAIL.test(mail)){form.classList.add('ungueltig');zeige('Bitte gib eine gültige E-Mail-Adresse ein.','fehler');input.focus();return;}
      input.value=mail;
      btn.disabled=true;btn.textContent='Wird gesendet …';form.classList.add('sendet');zeige('');

      fetch(form.getAttribute('action')+'?isAjax=1',{method:'POST',body:new FormData(form)})
        .then(function(r){return r.text();})
        .then(function(t){
          var d;try{d=JSON.parse(t);}catch(x){d=null;}
          if(d&&d.success){erfolg(mail);return;}
          var msg=(d&&d.message)||'';
          if(d&&d.errors){for(var k in d.errors){if(d.errors[k]){msg=String(d.errors[k]);break;}}}
          if(!d){ausweichen();return;}
          zurueck();zeige(msg||'Das hat nicht geklappt. Bitte versuch es gleich noch einmal.','fehler');
        })
        .catch(ausweichen);
    });

    function zurueck(){btn.disabled=false;btn.textContent=label;form.classList.remove('sendet');}
    function ausweichen(){
      /* Antwort nicht lesbar (Netzwerk, Blocker). Die Anfrage kann trotzdem angekommen sein,
         deshalb nicht doppelt senden, sondern einen Ausweg zur Brevo-Seite anbieten. */
      zurueck();
      status.className='nl-status ok';status.textContent='';
      status.appendChild(document.createTextNode('Wenn alles geklappt hat, kommt gleich eine Bestätigungsmail. Kommt nichts an, '));
      var a=document.createElement('a');a.href=form.getAttribute('action');a.target='_blank';a.rel='noopener';a.textContent='melde dich hier direkt an';
      status.appendChild(a);status.appendChild(document.createTextNode('.'));
    }
    function erfolg(mail){
      var box=document.createElement('div');box.className='nl-erfolg';box.setAttribute('role','status');
      var h=document.createElement('strong');h.textContent='Fast geschafft.';
      var p=document.createElement('p');p.appendChild(document.createTextNode('Ich habe dir eine Mail an '));
      var b=document.createElement('b');b.textContent=mail;p.appendChild(b);
      p.appendChild(document.createTextNode(' geschickt. Klick auf den Link darin, erst dann bist du angemeldet. Schau auch im Spam-Ordner nach.'));
      box.appendChild(h);box.appendChild(p);
      form.replaceWith(box);
    }
  });
})();
