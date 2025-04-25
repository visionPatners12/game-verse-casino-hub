
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createRoomSchema, type CreateRoomFormData } from "./schemas/createRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { PlayersField } from "./components/PlayersField";
import { WinnersField } from "./components/WinnersField";
import { GridSizeField } from "./components/GridSizeField";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { Input } from "@/components/ui/input";
import { Timer, Text } from "lucide-react";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";
import { GameCode } from "@/lib/gameTypes";
import { useState } from "react";
import { RulesDialog } from "@/components/game/RulesDialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
