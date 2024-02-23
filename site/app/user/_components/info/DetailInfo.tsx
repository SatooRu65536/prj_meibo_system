import { MemberDetailInfo } from '@/type/response';

type Props = {
  user: MemberDetailInfo;
};

export default function DetailInfo(props: Props) {
  const { user } = props;

  return <div>Info</div>;
}
