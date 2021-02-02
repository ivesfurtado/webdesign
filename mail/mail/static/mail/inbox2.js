document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(reply, content) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  if (!reply) {
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  } else {
    document.querySelector('#compose-recipients').value = content['recipient'];
    document.querySelector('#compose-subject').value = `Re: ${content['subject']}`;
    document.querySelector('#compose-body').value = `\n\nOn ${content['timestamp']} ${content['recipient']} wrote: \n${content['body']}`;
  }

  const form = document.getElementById("compose-form");
  form.addEventListener("submit", () => {
    send_mail();
  });
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  get_emails(mailbox);
}

function send_mail() {  
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    });
}

function get_emails(mailbox) {
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      emails.forEach(mail => {
        const element = document.createElement('div');
        element.className = 'mail';
        element.innerHTML = `<a href="#"><b>${mail["sender"]}</b> | ${mail["subject"]} </a>`;
        element.addEventListener('click', function() {
          if (!mail["read"]) {
            read_mail(mail["id"]);
          }
          let email = get_email(mail["id"]);
          console.log(email);
        });
        document.querySelector('#emails-view').append(element);
    });
  });
}

function get_email(mail_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-email-view').style.display = 'block';
  
  if (document.querySelector('.email_opened')) {
    var element = document.querySelector('.email_opened');
    var button = document.querySelector('.archive-button');
    var reply = document.querySelector('.reply-button');
    button.remove();
    element.remove();
    reply.remove();
  }

  fetch(`/emails/${mail_id}`)
  .then(response => response.json())
  .then(mail => {
      // Print emails
      console.log(mail);

      // ... do something else with emails ...
      const element = document.createElement('div');
      element.className = 'email_opened mail';
      element.innerHTML = `<p style='font-weight:bold;padding:2px;'><bold>From:</bold> ${mail["sender"]}</p>
                            <br>
                            <p><bold>To:</bold> ${mail["recipients"]}</p>
                            <br>
                            <p><bold>Subject:</bold> ${mail["subject"]}</p>
                            <br>
                            <p class="text-break">${mail["body"]}</p>`;

      const button = document.createElement('button');
      button.className = 'archive-button btn btn-sm btn-outline-primary';
      if (mail["archived"]) {
        button.innerHTML = `Unarchive`;
        button.addEventListener('click', () => archive_mail(mail["id"], true));
      } else {
        button.innerHTML = `Archive`;
        button.addEventListener('click', () => archive_mail(mail["id"], false));
      }

      const reply = document.createElement('reply');
      reply.className = 'reply-button btn btn-sm btn-outline-primary';
      reply.innerHTML = `Reply`;
      var content = {"recipient": mail["sender"],
                      "subject": mail["subject"],
                      "body": mail["body"],
                      "timestamp": mail["timestamp"]
                      };
      reply.addEventListener('click', () => compose_email(true, content));

      document.querySelector('#single-email-view').append(element);
      document.querySelector('#single-email-view').append(button);
      document.querySelector('#single-email-view').append(reply);
    });
}

function archive_mail(mail_id, is_archived) {
  if (is_archived) {
    fetch(`/emails/${mail_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
  } else {
    fetch(`/emails/${mail_id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  }
  load_mailbox('inbox');
}

function read_mail(mail_id) {
  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}

function url_state(state) {
    const section = this.dataset.section;
    history.pushState({section: section}, "", `${state}`);
}