"use client";

import { AlertCircle, RefreshCw, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ErrorMessageProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  variant?: "default" | "location";
};

export const ErrorMessage = ({
  title,
  message,
  onRetry,
  variant = "default",
}: ErrorMessageProps) => {
  const Icon = variant === "location" ? MapPinOff : AlertCircle;

  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <Icon className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

type LocationPermissionProps = {
  onRetry: () => void;
  onManualSearch: () => void;
};

export const LocationPermissionError = ({
  onRetry,
  onManualSearch,
}: LocationPermissionProps) => {
  return (
    <Card className="border-amber-500/50 bg-amber-500/5">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <div className="rounded-full bg-amber-500/10 p-4">
          <MapPinOff className="h-8 w-8 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">위치 정보를 가져올 수 없습니다</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            브라우저에서 위치 정보 접근을 허용하거나, 검색창에서 도시를 직접 검색해 주세요.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            다시 시도
          </Button>
          <Button onClick={onManualSearch} className="gap-2">
            도시 검색하기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
