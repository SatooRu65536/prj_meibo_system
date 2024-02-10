'use client';

import { useUserState } from '@/globalStates/firebaseUserState';
import styles from './registration.module.scss';
import { HTMLProps } from 'react';
import Button from '@/components/ui/Button';

export default function RegistrationPage() {
  const user = useUserState();

  return (
    <main className={styles.registration}>
      <section className={styles.registration_section}>
        <Wrapper titile="アイコン">
          <Icon src={user?.photoURL ?? undefined} />
        </Wrapper>

        <Wrapper titile="名前">
          <Input
            type="text"
            placeholder="佐藤 智"
            supplement="姓と名の間には空白を入れてください"
          />
        </Wrapper>

        <Wrapper titile="名前(フリガナ)">
          <Input
            type="text"
            placeholder="サトウ サトル"
            supplement="姓と名の間には空白を入れてください"
          />
        </Wrapper>

        <Wrapper titile="卒業(予定)年度">
          <Input
            type="number"
            placeholder={String(new Date().getFullYear() + 5)}
          />
        </Wrapper>

        <Wrapper titile="技術スタック" supplement="触った事がある技術など">
          <Input
            type="text"
            placeholder="C言語, Web制作, Next.js"
            supplement="「,」で区切ってください"
          />
        </Wrapper>

        <Wrapper titile="タイプ">
          <Select options={['', '現役部員', 'OB・OG', '外部']} />
        </Wrapper>

        {/* <ActiveMember /> */}
        {/* <OBOGMember /> */}
        {/* <ExternalMember /> */}

        <div className={styles.descript_container}>
          <p>以下の項目は本人と役員以外には非公開となります</p>
        </div>

        <Wrapper titile="性別">
          <Select options={['', '男', '女', 'その他']} />
        </Wrapper>

        <Wrapper titile="生年月日">
          <Input type="date" />
        </Wrapper>

        <Wrapper titile="電話番号(携帯)">
          <Input
            type="text"
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx-xxxx"
          />
        </Wrapper>

        <Wrapper titile="メールアドレス">
          <Input
            type="email"
            supplement="愛工大アカウント以外を入力してください"
            placeholder="xxx@xxx.xxx"
          />
        </Wrapper>

        <Wrapper titile="現在の郵便番号">
          <Input
            type="text"
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx"
          />
        </Wrapper>

        <Wrapper titile="現在の住所">
          <Input type="text" supplement="" placeholder="x県x市x町x-xx-xx" />
        </Wrapper>

        <Wrapper
          titile="実家の郵便番号"
          supplement="実家暮らしの場合は現在と同じ"
        >
          <Input
            type="text"
            supplement="「-」で区切ってください"
            placeholder="xxx-xxxx"
          />
        </Wrapper>

        <Wrapper titile="実家の住所" supplement="実家暮らしの場合は現在と同じ">
          <Input type="text" supplement="" placeholder="x県x市x町x-xx-xx" />
        </Wrapper>
      </section>

      <section className={styles.buttons_section}>
        <Button className={styles.next}>次へ</Button>
      </section>
    </main>
  );
}

function ActiveMember() {
  return (
    <>
      <Wrapper titile="学年">
        <Select options={['', 'B1', 'B2', 'B3', 'B4', 'M1', 'M2', 'その他']} />
      </Wrapper>

      <Wrapper titile="学籍番号" supplement="現在の学籍番号">
        <Input type="text" placeholder="k23075" />
      </Wrapper>

      <Wrapper titile="役職" supplement="現在の役職">
        <Input type="text" supplement="なければ空白にしてください" />
      </Wrapper>
    </>
  );
}

function OBOGMember() {
  return (
    <>
      <Wrapper titile="学籍番号" supplement="卒業時の学籍番号">
        <Input type="text" placeholder="k23075" />
      </Wrapper>

      <Wrapper titile="旧役職" supplement="最終的な役職">
        <Input type="text" supplement="なければ空白にしてください" />
      </Wrapper>

      <Wrapper titile="就職先(任意)">
        <Input type="text" />
      </Wrapper>
    </>
  );
}

function ExternalMember() {
  return (
    <>
      <Wrapper titile="学校">
        <Input type="text" supplement="なければ空白にしてください" />
      </Wrapper>

      <Wrapper titile="所属団体">
        <Input type="text" supplement="なければ空白にしてください" />
      </Wrapper>
    </>
  );
}

type WrapperProps = {
  titile: string;
  supplement?: string;
  children: React.ReactNode;
};

function Wrapper(props: WrapperProps) {
  const { titile, supplement, children } = props;

  return (
    <div className={styles.wrapper}>
      <div className={styles.title_container}>
        <h3 className={styles.title}>{titile}</h3>
        {supplement && <p className={styles.supplement}>{supplement}</p>}
      </div>

      <div>{children}</div>
    </div>
  );
}

type InputProps = HTMLProps<HTMLInputElement> & {
  supplement?: string;
};

function Input(props: InputProps) {
  const { className, supplement, ...others } = props;

  return (
    <div {...others} className={`${styles.input_container} ${className}`}>
      <input {...others} className={styles.input} />
      {supplement && <p className={styles.supplement}>{supplement}</p>}
    </div>
  );
}

type SelectProps = HTMLProps<HTMLSelectElement> & {
  options: string[];
};

function Select(props: SelectProps) {
  const { options, ...others } = props;

  return (
    <select {...others} className={styles.select}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function Icon(props: { src: string | undefined }) {
  const { src } = props;

  return (
    <div className={styles.icon_wrapper}>
      {src && <img src={src} alt="アイコン" className={styles.icon} />}
    </div>
  );
}
