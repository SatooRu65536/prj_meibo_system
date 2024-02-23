import { MemberInfo } from '@/type/response';

type Props = {
  user: MemberInfo;
};

export default function Info(props: Props) {
  const { user } = props;

  return <div>Info</div>;
}
