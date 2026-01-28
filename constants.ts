import { TaskBlock } from './types';

export const TASK_BLOCKS: TaskBlock[] = [
  {
    id: 'morning',
    title: 'УТРО',
    tasks: [
      { id: 'rhodiola', label: 'Родиола розовая', notes: 'После пробуждения' },
      { id: 'training_am', label: 'Тренировка', notes: 'Утренняя сессия' },
      { id: 'implant_install', label: 'Установить имплант "Nicorette"', notes: 'Системная интеграция' },
      { id: 'ascorbate', label: 'Аскорбат Натрия', notes: 'После завтрака' },
      { id: 'omega3', label: 'Омега-3', notes: 'После завтрака' },
      { id: 'd3', label: 'Д-3', notes: 'После завтрака' },
      { id: 'zinc', label: 'Цинк', notes: 'После завтрака' },
    ],
  },
  {
    id: 'day',
    title: 'ДЕНЬ',
    tasks: [
      { id: 'training_noon', label: 'Тренировка', notes: 'Дневная сессия' },
      { id: 'psyllium_noon', label: 'Псиллиум', notes: 'Перед обедом' },
    ],
  },
  {
    id: 'evening',
    title: 'ВЕЧЕР',
    tasks: [
      { id: 'training_pm', label: 'Тренировка', notes: 'Вечерняя сессия' },
      { id: 'psyllium_pm', label: 'Псиллиум', notes: 'Перед ужином' },
      { id: 'magnesium', label: 'Магний', notes: 'Перед сном' },
      { id: 'implant_remove', label: 'Снять имплант "Nicorette"', notes: 'Отключение системы' },
    ],
  },
  {
    id: 'allday',
    title: 'ВЕСЬ ДЕНЬ',
    tasks: [
      { id: 'water', label: 'Вода / Гидратация', notes: 'Поддержание уровня жидкости' },
    ],
  },
];

export const TOTAL_DAILY_TASKS = TASK_BLOCKS.reduce((acc, block) => acc + block.tasks.length, 0);

export const LEVELS = [
  { name: 'Новичок', minXp: 0 },
  { name: 'Скрипт-кидди', minXp: 50 },
  { name: 'Нетраннер', minXp: 200 },
  { name: 'Эджраннер', minXp: 500 },
  { name: 'Киберпсих', minXp: 1000 },
  { name: 'Легенда Найт-Сити', minXp: 2000 },
  { name: 'Конструкт', minXp: 5000 },
];