import React, { lazy, Suspense } from "react";
import { Route } from "react-router";
import { AnimationRoutes, Spinner } from "zmp-ui";
import { Navigation } from "../components/Navigation";
import { MasterLayout } from "./MasterLayout";
import ProtectedRoute from "./_core/ProtectedRoute";

const CataloguePage = lazy(() => import("../pages/catalogue"));
const CatalogueServicePage = lazy(
  () => import("../pages/catalogue/CatalogueService"),
);
const CatalogueDetailPage = lazy(() => import("../pages/catalogue/detail"));

const CartPage = lazy(() => import("../pages/cart"));
const CartFinish = lazy(() => import("../pages/cart/CartFinish"));

const CheckInPage = lazy(() => import("../pages/checkin"));

const UserPage = lazy(() => import("../pages/user"));

const CustomerDiary = lazy(() => import("../pages/user/CustomerDiary"));
const CustomerOrders = lazy(() => import("../pages/user/CustomerOrders"));
const CustomerVoucher = lazy(() => import("../pages/user/CustomerVoucher"));
const CustomerWalletCard = lazy(
  () => import("../pages/user/CustomerWalletCard"),
);
const CustomerPoints = lazy(() => import("../pages/user/CustomerPoints"));
const CustomerService = lazy(() => import("../pages/user/CustomerService"));
const CustomerBookingManage = lazy(
  () => import("../pages/user/CustomerBookingManage"),
);
const CustomerProfile = lazy(() => import("../pages/user/CustomerProfile"));
const CustomerBranch = lazy(() => import("../pages/user/CustomerBranch"));
const CustomerBranchDetail = lazy(
  () => import("../pages/user/CustomerBranchDetail"),
);

const BookingPage = lazy(() => import("../pages/booking"));

const SearchPage = lazy(() => import("../pages/search"));

const ContactPage = lazy(() => import("../pages/contact"));

import HomePage from "../pages/home";
import { SheetRating } from "../components/SheetRating";
import { useLayout } from "./LayoutProvider";

const ReviewsPage = lazy(() => import("../pages/reviews"));
const ReviewsDetailPage = lazy(() => import("../pages/reviews/detail"));
const ReviewsAddPage = lazy(() => import("../pages/reviews/add"));

const CustomerRating = lazy(() => import("../pages/user/CustomerRating"));

const CustomerAffs = lazy(() => import("../pages/user/CustomerAffs"));

const NewsPage = lazy(() => import("../pages/news"));
const NewsDetailPage = lazy(() => import("../pages/news/detail"));

const CoursesPage = lazy(() => import("../pages/courses"));
const CoursesDetailPage = lazy(() => import("../pages/courses/detail"));
const CoursesDetail2Page = lazy(() => import("../pages/courses/detail-courses"));

const CooperatePage = lazy(() => import("../pages/cooperate"));

const LibraryPage = lazy(() => import("../pages/library"));
const LibraryDetailPage = lazy(() => import("../pages/library/detail"));

const OffersPage = lazy(() => import("../pages/offers"));
const OffersDetailPage = lazy(() => import("../pages/offers/detail"));

const AdvDetailPage = lazy(() => import("../pages/news/detail-adv"));

const SuspensedView = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="fixed top-0 left-0 w-full h-full z-[10001] flex justify-center items-center bg-white">
          <Spinner visible />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

const Layout = () => {
  const { Ratings } = useLayout();
  return (
    <MasterLayout>
      <AnimationRoutes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/catalogue"
          element={
            <SuspensedView>
              <CataloguePage />
            </SuspensedView>
          }
        />
        <Route
          path="/catalogue/:id"
          element={
            <SuspensedView>
              <CatalogueDetailPage />
            </SuspensedView>
          }
        />
        <Route
          path="/catalogue/service/:id"
          element={
            <SuspensedView>
              <CatalogueServicePage />
            </SuspensedView>
          }
        />
        <Route
          path="/news"
          element={
            <SuspensedView>
              <NewsPage />
            </SuspensedView>
          }
        />
        <Route
          path="/news/:id"
          element={
            <SuspensedView>
              <NewsDetailPage />
            </SuspensedView>
          }
        />
        <Route
          path="/courses"
          element={
            <SuspensedView>
              <CoursesPage />
            </SuspensedView>
          }
        />
        <Route
          path="/courses-sale/:id"
          element={
            <SuspensedView>
              <CoursesDetail2Page />
            </SuspensedView>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <SuspensedView>
              <CoursesDetailPage />
            </SuspensedView>
          }
        />
        <Route
          path="/cooperate"
          element={
            <SuspensedView>
              <CooperatePage />
            </SuspensedView>
          }
        />
        <Route
          path="/adv/:id"
          element={
            <SuspensedView>
              <AdvDetailPage />
            </SuspensedView>
          }
        />
        <Route
          path="/reviews"
          element={
            <SuspensedView>
              <ReviewsPage />
            </SuspensedView>
          }
        />
        <Route
          path="/reviews/add"
          element={
            <SuspensedView>
              <ReviewsAddPage />
            </SuspensedView>
          }
        />

        <Route
          path="/reviews/:id"
          element={
            <SuspensedView>
              <ReviewsDetailPage />
            </SuspensedView>
          }
        />
        <Route
          path="/reviews/same/:id"
          element={
            <SuspensedView>
              <ReviewsDetailPage />
            </SuspensedView>
          }
        />
        <Route
          path="/library"
          element={
            <SuspensedView>
              <LibraryPage />
            </SuspensedView>
          }
        />
        <Route
          path="/library/:id"
          element={
            <SuspensedView>
              <LibraryDetailPage />
            </SuspensedView>
          }
        />
        <Route
          path="/offers"
          element={
            <SuspensedView>
              <OffersPage />
            </SuspensedView>
          }
        />
        <Route
          path="/offers/:id"
          element={
            <SuspensedView>
              <OffersDetailPage />
            </SuspensedView>
          }
        />

        <Route
          path="/cart"
          element={
            <SuspensedView>
              <CartPage />
            </SuspensedView>
          }
        />
        <Route
          path="/cart/finish"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CartFinish />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <SuspensedView>
              <UserPage />
            </SuspensedView>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerProfile />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-branch"
          element={
            <SuspensedView>
              <CustomerBranch />
            </SuspensedView>
          }
        />
        <Route
          path="/user/customer-branch/:id"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerBranchDetail />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-diary"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerDiary />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-service"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerService />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-orders"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerOrders />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-voucher"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerVoucher />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-wallet-card"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerWalletCard />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-points"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerPoints />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-rating"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerRating />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-affs"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerAffs />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/customer-booking-manage"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CustomerBookingManage />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkin"
          element={
            <ProtectedRoute>
              <SuspensedView>
                <CheckInPage />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <SuspensedView>
              <BookingPage />
            </SuspensedView>
          }
        />
        <Route
          path="/search"
          element={
            <SuspensedView>
              <SearchPage />
            </SuspensedView>
          }
        />
        <Route
          path="/contact"
          element={
            <SuspensedView>
              <ContactPage />
            </SuspensedView>
          }
        />
      </AnimationRoutes>
      <Navigation />
      {/* {Ratings && Ratings.length > 0 && <SheetRating data={Ratings} />} */}
    </MasterLayout>
  );
};

export { Layout };
