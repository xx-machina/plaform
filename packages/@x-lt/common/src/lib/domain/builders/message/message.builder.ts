import { ScholarshipSatusCounter } from '../../models/notion';
import dayjs from 'dayjs';

export class MessageBuilder {
  buildSatusCountMessage(counter: ScholarshipSatusCounter) {
      return `＝現在の応募状況 (${dayjs().format('MM/DD')})=
    応募者数: ${counter.応募者数}人
    一次選考中: ${counter.一次選考中}人
    一次選考通過者数: ${counter.一次選考通過者数}人
    二次選考中: ${counter.二次選考中}人
    二次選考通過者数: ${counter.二次選考通過者数}人
    `;
  }
}
