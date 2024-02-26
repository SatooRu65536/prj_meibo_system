import styles from "./approveBtn.module.scss";
import { basePutFetcher } from "@/components/fetcher";
import Button from "@/components/ui/Button";
import { useUserState } from "@/globalStates/firebaseUserState";
import { useIsAdminState } from "@/globalStates/isAdmin";
import { MemberWithPrivateInfo } from "@/type/member";
import { MemberRes } from "@/type/response";

type Props = {
  id: string | null;
}

export default function ApproveBtn(props: Props) {
  const { id } = props;
  const isAdmin = useIsAdminState();
  const user = useUserState();

  async function approve(id: string) {
    const token = await user?.getIdToken();
    const res = await basePutFetcher<MemberRes<MemberWithPrivateInfo>>(
      `/api/user/${id}/approve`,
      token,
      {},
    );

    if (res === undefined) alert('承認に失敗しました');
    else if (res.ok === false) alert(`${res.message}\n${res.approach ?? ''}`);
    else alert('承認しました');
  }

  return (
    <section className={styles.approve_section}>
      {isAdmin && id && <Button className={styles.approve_btn} onClick={() => approve(id)}>承認</Button>}
    </section>
  );
}