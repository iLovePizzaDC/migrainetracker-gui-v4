import { useAuthCheck } from "../../../shared/auth/use-auth-check";
import { useUser } from "../../../shared/hooks/user/use-user";
import CardSection from "../components/organisms/card/CardSection";

function OverviewPage() {
  const { user, setUser } = useUser();
  useAuthCheck(user, setUser);

  return (
    <div>
      <CardSection />
    </div>
  );
}

export default OverviewPage;
