import $ from './dom';
import * as request from './request';

function getEditElements(id: number): Array<any> {
  const selector: string = `.reminder[data-id="${id}"]`;
  const reminder = $(selector);

  const editElements = reminder.querySelectorAll('.edit,.edit-ui');
  const reminderElements = [
    reminder.querySelector('.title'),
    reminder.querySelector('.content'),
    reminder.querySelector('.context-menu')
  ];

  return [ editElements, reminderElements ];
}

export function showEditingUI(reminderId: number) {
  const [ editElements, reminderElements ] = getEditElements(reminderId);
  editElements.forEach(el => el.classList.add('show'));
  reminderElements.forEach(el => el.classList.add('hide'));
}

export function hideEditingUI(reminderId: number) {
  const [ editElements, reminderElements ] = getEditElements(reminderId);
  editElements.forEach(el => el.classList.remove('show'));
  reminderElements.forEach(el => el.classList.remove('hide'));
}

// TODO: create a Reminder Interface!
function updateReminderElement(id: number, reminder: any) {
  const reminderElement = $(`.reminder[data-id="${id}"]`);
  const title = reminderElement.querySelector('.title');
  const content = reminderElement.querySelector('.content');

  title.innerText = reminder.title;
  content.innerText = reminder.reminder;
  hideEditingUI(id);
}

function showErrorUI(id) {
  const [ editElements ] = getEditElements(id);
  editElements.forEach(el => el.classList.add('error'));
}

function removeErrorUI(id) {
  const [ editElements ] = getEditElements(id);
  editElements.forEach(el => el.classList.remove('error'));
}

export function updateReminder(id, updatedReminder) {
  const route = `/api/reminders/update/${id}`;
  const data = {
    body: updatedReminder
  };

  request.post(route, data)
    .then(() => {
      removeErrorUI(id);
      updateReminderElement(id, updatedReminder);
    })
    .catch(() => {
      showErrorUI(id);
    });
}