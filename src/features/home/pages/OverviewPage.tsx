import { useAuthCheck } from "../../../shared/auth/use-auth-check";
import { useUser } from "../../../shared/hooks/user/use-user";
import CardSection from "../components/organisms/card/CardSection";
import { CardSetupsProvider } from "../hooks/card/card-setups-provider";

function OverviewPage() {
  const { user, setUser } = useUser();
  useAuthCheck(user, setUser);

  return (
    <div className="w-full">
      <CardSetupsProvider>
        <div className="max-w-6xl mx-auto px-4">
          <CardSection />
        </div>
      </CardSetupsProvider>
    </div>
  );
}

export default OverviewPage;
